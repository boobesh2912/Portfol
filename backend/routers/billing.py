from fastapi import APIRouter, Depends, HTTPException, Request
from dependencies import get_current_user, get_supabase_client
import os

router = APIRouter(prefix="/api/billing", tags=["billing"])

# Phase 6: Replace stubs with real Dodo Payments SDK calls when DODO_API_KEY is provided.


@router.post("/checkout")
async def create_checkout(user=Depends(get_current_user)):
    # TODO Phase 6: implement with dodopayments SDK
    raise HTTPException(status_code=501, detail="Billing not yet configured. Phase 6.")


@router.post("/portal")
async def open_portal(user=Depends(get_current_user)):
    # TODO Phase 6: implement with dodopayments SDK
    raise HTTPException(status_code=501, detail="Billing not yet configured. Phase 6.")


@router.post("/webhook")
async def handle_webhook(request: Request):
    # TODO Phase 6: verify signature + handle subscription events
    return {"ok": True}
