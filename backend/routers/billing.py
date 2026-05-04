import hashlib
import hmac
import json
import os
import logging

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse

from dependencies import get_current_user, get_supabase_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/billing", tags=["billing"])

# ---------------------------------------------------------------------------
# Config helpers
# ---------------------------------------------------------------------------

def _base_url() -> str:
    test_mode = os.environ.get("DODO_TEST_MODE", "true").lower() == "true"
    return "https://test.dodopayments.com" if test_mode else "https://live.dodopayments.com"


def _api_key() -> str:
    key = os.environ.get("DODO_API_KEY", "")
    if not key:
        raise HTTPException(status_code=503, detail="Billing is not configured (missing DODO_API_KEY)")
    return key


def _product_id() -> str:
    pid = os.environ.get("DODO_PRODUCT_ID", "")
    if not pid:
        raise HTTPException(status_code=503, detail="Billing is not configured (missing DODO_PRODUCT_ID)")
    return pid


def _frontend_url() -> str:
    return os.environ.get("FRONTEND_URL", "http://localhost:5173").split(",")[0].strip()


# ---------------------------------------------------------------------------
# POST /api/billing/checkout
# ---------------------------------------------------------------------------

async def _fetch_clerk_email(user_id: str) -> str:
    """Fetch user's primary email from Clerk Backend API using CLERK_SECRET_KEY."""
    secret_key = os.environ.get("CLERK_SECRET_KEY", "")
    if not secret_key:
        return ""
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            resp = await client.get(
                f"https://api.clerk.com/v1/users/{user_id}",
                headers={"Authorization": f"Bearer {secret_key}"},
            )
        if resp.status_code == 200:
            data = resp.json()
            addrs = data.get("email_addresses", [])
            primary_id = data.get("primary_email_address_id")
            for addr in addrs:
                if addr.get("id") == primary_id:
                    return addr.get("email_address", "")
            if addrs:
                return addrs[0].get("email_address", "")
    except Exception:
        pass
    return ""


@router.post("/checkout")
async def create_checkout(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]

    row = supabase.table("profiles").select("email_public, full_name, username").eq("id", profile_id).limit(1).execute()
    profile = row.data[0] if row.data else {}

    email = profile.get("email_public") or user.get("email", "")
    name  = profile.get("full_name") or "Vizhva User"

    # Fallback for Google OAuth users whose email wasn't stored at signup
    if not email:
        email = await _fetch_clerk_email(profile_id)
        if email:
            # Persist so future checkouts don't need the Clerk API call
            supabase.table("profiles").update({"email_public": email}).eq("id", profile_id).execute()

    if not email:
        raise HTTPException(status_code=400, detail="Could not retrieve your email. Please add one in Settings → Profile.")

    return_url = f"{_frontend_url()}/dashboard/settings?upgrade=success"

    payload = {
        "product_cart": [{"product_id": _product_id(), "quantity": 1}],
        "customer": {"email": email, "name": name},
        "return_url": return_url,
        "metadata": {"clerk_user_id": profile_id},
    }

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(
            f"{_base_url()}/checkouts",
            json=payload,
            headers={
                "Authorization": f"Bearer {_api_key()}",
                "Content-Type": "application/json",
            },
        )

    logger.info(f"Dodo checkout response: {resp.status_code} - {resp.text[:500]}")

    if resp.status_code not in (200, 201):
        logger.error(f"Dodo checkout failed: {resp.status_code} - {resp.text}")
        raise HTTPException(
            status_code=502,
            detail=f"Dodo Payments error {resp.status_code}: {resp.text[:300]}",
        )

    data = resp.json()
    checkout_url = data.get("checkout_url") or data.get("url") or data.get("payment_link")
    if not checkout_url:
        logger.error(f"Dodo response missing checkout_url: {data}")
        raise HTTPException(status_code=502, detail=f"Dodo response missing checkout_url: {data}")

    logger.info(f"Checkout URL generated: {checkout_url}")
    return {"checkout_url": checkout_url}


# ---------------------------------------------------------------------------
# POST /api/billing/portal
# ---------------------------------------------------------------------------

@router.post("/portal")
async def open_portal(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]

    row = supabase.table("profiles").select("dodo_subscription_id").eq("id", profile_id).limit(1).execute()
    profile = row.data[0] if row.data else {}
    sub_id = profile.get("dodo_subscription_id")

    if not sub_id:
        raise HTTPException(status_code=404, detail="No active subscription found")

    # Try to fetch customer portal link from Dodo
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            f"{_base_url()}/subscriptions/{sub_id}",
            headers={"Authorization": f"Bearer {_api_key()}"},
        )

    if resp.status_code == 200:
        data = resp.json()
        portal_url = (
            data.get("customer_portal_url")
            or data.get("portal_url")
            or "https://app.dodopayments.com/billing"
        )
    else:
        # Fallback: send user to Dodo's self-service billing page
        portal_url = "https://app.dodopayments.com/billing"

    return {"portal_url": portal_url}


# ---------------------------------------------------------------------------
# POST /api/billing/webhook  (public — no auth)
# ---------------------------------------------------------------------------

@router.post("/webhook")
async def handle_webhook(request: Request):
    raw_body = await request.body()

    # Verify HMAC-SHA256 signature
    secret = os.environ.get("DODO_WEBHOOK_SECRET", "")
    if secret:
        sig_header = request.headers.get("webhook-signature", "")
        expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
        # Dodo may send "v1,<hex>" format — extract the hex part
        received = sig_header.split(",")[-1].strip() if "," in sig_header else sig_header
        if not hmac.compare_digest(expected, received):
            logger.warning(f"Invalid webhook signature: expected {expected}, received {received}")
            return JSONResponse(status_code=400, content={"error": "Invalid webhook signature"})

    try:
        event = json.loads(raw_body)
    except Exception as e:
        logger.error(f"Invalid JSON in webhook: {e}")
        return JSONResponse(status_code=400, content={"error": "Invalid JSON body"})

    event_type = event.get("type") or event.get("event_type", "")
    data = event.get("data", {})

    logger.info(f"Webhook received: {event_type} - {data}")

    supabase = get_supabase_client()

    try:
        if event_type == "subscription.active":
            clerk_user_id = (data.get("metadata") or {}).get("clerk_user_id")
            sub_id = data.get("subscription_id") or data.get("id")
            if clerk_user_id:
                supabase.table("profiles").update({
                    "is_pro": True,
                    "dodo_subscription_id": sub_id,
                    "subscription_status": "active",
                }).eq("id", clerk_user_id).execute()
                logger.info(f"Activated subscription for user {clerk_user_id}")

        elif event_type in ("subscription.on_hold", "subscription.failed", "subscription.cancelled"):
            clerk_user_id = (data.get("metadata") or {}).get("clerk_user_id")
            if clerk_user_id:
                supabase.table("profiles").update({
                    "is_pro": False,
                    "subscription_status": event_type.split(".")[-1],
                }).eq("id", clerk_user_id).execute()
                logger.info(f"Updated subscription status to {event_type} for user {clerk_user_id}")

        elif event_type == "subscription.renewed":
            clerk_user_id = (data.get("metadata") or {}).get("clerk_user_id")
            if clerk_user_id:
                supabase.table("profiles").update({
                    "is_pro": True,
                    "subscription_status": "active",
                }).eq("id", clerk_user_id).execute()
                logger.info(f"Renewed subscription for user {clerk_user_id}")

        elif event_type == "payment.succeeded":
            pass  # subscription.active handles access grant

        else:
            logger.warning(f"Unhandled webhook event type: {event_type}")

    except Exception as e:
        logger.error(f"Error processing webhook {event_type}: {e}")
        return JSONResponse(status_code=500, content={"error": "Internal server error"})

    return {"received": True}
