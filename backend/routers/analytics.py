from fastapi import APIRouter, Depends, Request, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import hashlib
import uuid
from dependencies import get_current_user, get_supabase_client
from main import limiter

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


def detect_device(user_agent: str) -> str:
    ua_lower = user_agent.lower()
    if any(x in ua_lower for x in ["mobile", "android", "iphone", "ipad"]):
        return "mobile"
    return "desktop"


def hash_ip(ip: str) -> str:
    return hashlib.sha256(ip.encode()).hexdigest()


async def record_view_task(username: str, ip_hash: str, country: str, device_type: str, referrer: str):
    supabase = get_supabase_client()
    supabase.table("page_views").insert({
        "id": str(uuid.uuid4()),
        "portfolio_username": username,
        "viewer_ip_hash": ip_hash,
        "country": country,
        "device_type": device_type,
        "referrer": referrer,
    }).execute()


class ViewPayload(BaseModel):
    username: str
    referrer: Optional[str] = None


@router.post("/view")
@limiter.limit("30/minute")
async def record_view(request: Request, payload: ViewPayload, background_tasks: BackgroundTasks):
    ip = (
        request.headers.get("CF-Connecting-IP")
        or request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
        or "unknown"
    )
    country = request.headers.get("CF-IPCountry", "unknown")
    user_agent = request.headers.get("User-Agent", "")
    device_type = detect_device(user_agent)
    ip_hash = hash_ip(ip)
    background_tasks.add_task(
        record_view_task, payload.username, ip_hash, country, device_type, payload.referrer or "direct"
    )
    return {"ok": True}


@router.get("/me")
async def get_my_analytics(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile = supabase.table("profiles").select("username").eq("id", user["sub"]).single().execute().data
    if not profile:
        return {}
    username = profile["username"]

    # Aggregate in the database instead of fetching all rows into Python.
    # Supabase exposes PostgreSQL via its REST layer; we use rpc() for custom SQL.
    result = supabase.rpc("get_portfolio_analytics", {"p_username": username}).execute()
    return result.data or {}
