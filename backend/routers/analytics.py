from fastapi import APIRouter, Depends, Request, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import hashlib
import uuid
from datetime import datetime, timedelta, timezone
from dependencies import get_current_user, get_supabase_client

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
async def record_view(payload: ViewPayload, request: Request, background_tasks: BackgroundTasks):
    ip = request.headers.get("CF-Connecting-IP") or request.headers.get("X-Forwarded-For", "").split(",")[0].strip() or "unknown"
    country = request.headers.get("CF-IPCountry", "unknown")
    user_agent = request.headers.get("User-Agent", "")
    device_type = detect_device(user_agent)
    ip_hash = hash_ip(ip)
    background_tasks.add_task(record_view_task, payload.username, ip_hash, country, device_type, payload.referrer or "direct")
    return {"ok": True}


@router.get("/me")
async def get_my_analytics(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile = supabase.table("profiles").select("username").eq("id", user["sub"]).single().execute().data
    if not profile:
        return {}
    username = profile["username"]

    all_views = supabase.table("page_views").select("*").eq("portfolio_username", username).execute().data

    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)
    thirty_days_ago = now - timedelta(days=30)

    views_7d = [v for v in all_views if datetime.fromisoformat(v["viewed_at"].replace("Z", "+00:00")) >= seven_days_ago]
    views_30d = [v for v in all_views if datetime.fromisoformat(v["viewed_at"].replace("Z", "+00:00")) >= thirty_days_ago]

    country_counts: dict = {}
    device_counts: dict = {}
    referrer_counts: dict = {}
    daily_counts: dict = {}

    for v in views_30d:
        c = v.get("country") or "unknown"
        country_counts[c] = country_counts.get(c, 0) + 1

        d = v.get("device_type") or "unknown"
        device_counts[d] = device_counts.get(d, 0) + 1

        r = v.get("referrer") or "direct"
        referrer_counts[r] = referrer_counts.get(r, 0) + 1

        day = v["viewed_at"][:10]
        daily_counts[day] = daily_counts.get(day, 0) + 1

    top_countries = sorted(country_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    top_referrers = sorted(referrer_counts.items(), key=lambda x: x[1], reverse=True)[:5]

    daily_series = []
    for i in range(30):
        day = (now - timedelta(days=29 - i)).strftime("%Y-%m-%d")
        daily_series.append({"date": day, "views": daily_counts.get(day, 0)})

    return {
        "total_views": len(all_views),
        "views_7d": len(views_7d),
        "views_30d": len(views_30d),
        "top_countries": [{"country": k, "count": v} for k, v in top_countries],
        "device_breakdown": device_counts,
        "top_referrers": [{"referrer": k, "count": v} for k, v in top_referrers],
        "daily_views": daily_series,
    }
