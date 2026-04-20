from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import socket
from dependencies import get_current_user, get_supabase_client
import os

router = APIRouter(prefix="/api/domain", tags=["domain"])

PORTFOL_CNAME_TARGET = "portfol.me"


class DomainConnect(BaseModel):
    domain: str


@router.post("/connect")
async def connect_domain(data: DomainConnect, user=Depends(get_current_user)):
    supabase = get_supabase_client()
    domain = data.domain.strip().lower().lstrip("https://").lstrip("http://").split("/")[0]
    supabase.table("profiles").update({
        "custom_domain": domain,
        "domain_verified": False,
    }).eq("id", user["sub"]).execute()
    return {
        "domain": domain,
        "dns_instructions": {
            "type": "CNAME",
            "name": domain,
            "value": PORTFOL_CNAME_TARGET,
            "ttl": 3600,
        },
        "message": "Add the CNAME record to your DNS provider, then verify.",
    }


@router.get("/verify")
async def verify_domain(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile = supabase.table("profiles").select("custom_domain, domain_verified").eq("id", user["sub"]).single().execute().data
    if not profile or not profile.get("custom_domain"):
        raise HTTPException(status_code=400, detail="No custom domain set")
    domain = profile["custom_domain"]
    verified = False
    try:
        resolved = socket.getaddrinfo(domain, None)
        target_ips = {r[4][0] for r in resolved}
        portfol_ips = {r[4][0] for r in socket.getaddrinfo(PORTFOL_CNAME_TARGET, None)}
        verified = bool(target_ips & portfol_ips)
    except Exception:
        verified = False
    if verified:
        supabase.table("profiles").update({"domain_verified": True}).eq("id", user["sub"]).execute()
    return {"domain": domain, "verified": verified}


@router.delete("")
async def remove_domain(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    supabase.table("profiles").update({"custom_domain": None, "domain_verified": False}).eq("id", user["sub"]).execute()
    return {"message": "Custom domain removed"}
