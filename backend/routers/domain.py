from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import dns.resolver
from dependencies import get_current_user, get_supabase_client

router = APIRouter(prefix="/api/domain", tags=["domain"])

VIZHVA_CNAME_TARGET = "vizhva.me"


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
            "value": VIZHVA_CNAME_TARGET,
            "ttl": 3600,
        },
        "message": "Add the CNAME record to your DNS provider, then verify.",
    }


@router.get("/verify")
async def verify_domain(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile = (
        supabase.table("profiles")
        .select("custom_domain, domain_verified")
        .eq("id", user["sub"])
        .single()
        .execute()
        .data
    )
    if not profile or not profile.get("custom_domain"):
        raise HTTPException(status_code=400, detail="No custom domain set")

    domain = profile["custom_domain"]
    verified = _verify_cname(domain)

    if verified:
        supabase.table("profiles").update({"domain_verified": True}).eq("id", user["sub"]).execute()

    return {"domain": domain, "verified": verified}


@router.delete("")
async def remove_domain(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    supabase.table("profiles").update({"custom_domain": None, "domain_verified": False}).eq("id", user["sub"]).execute()
    return {"message": "Custom domain removed"}


def _verify_cname(domain: str) -> bool:
    """Return True if domain has a CNAME that resolves (directly or transitively)
    to VIZHVA_CNAME_TARGET. Falls back to False on any DNS error."""
    target = VIZHVA_CNAME_TARGET.rstrip(".").lower()
    try:
        resolver = dns.resolver.Resolver()
        resolver.lifetime = 5  # seconds

        # Walk the CNAME chain; dnspython's resolve() follows aliases automatically.
        answers = resolver.resolve(domain, "CNAME")
        for rdata in answers:
            cname_value = str(rdata.target).rstrip(".").lower()
            if cname_value == target or cname_value.endswith("." + target):
                return True
        return False
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN):
        # Domain has no CNAME record at all.
        return False
    except Exception:
        return False
