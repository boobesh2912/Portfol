from fastapi import APIRouter, Depends
from typing import List
from pydantic import BaseModel
from dependencies import get_current_user, get_supabase_client
import uuid

router = APIRouter(prefix="/api/skills", tags=["skills"])


class SkillItem(BaseModel):
    name: str
    order_index: int = 0


class SocialItem(BaseModel):
    platform: str
    url: str


@router.put("")
async def upsert_skills(items: List[SkillItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    supabase.table("skills").delete().eq("profile_id", profile_id).execute()
    if not items:
        return []
    rows = [{"id": str(uuid.uuid4()), "profile_id": profile_id, "name": it.name, "order_index": it.order_index} for it in items]
    result = supabase.table("skills").insert(rows).execute()
    return result.data


@router.put("/social")
async def upsert_social_links(items: List[SocialItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    supabase.table("social_links").delete().eq("profile_id", profile_id).execute()
    if not items:
        return []
    rows = [{"id": str(uuid.uuid4()), "profile_id": profile_id, "platform": it.platform, "url": it.url} for it in items]
    result = supabase.table("social_links").insert(rows).execute()
    return result.data
