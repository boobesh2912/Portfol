from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import Optional
import re
from pydantic import BaseModel
from dependencies import get_current_user, get_supabase_client

router = APIRouter(prefix="/api/profile", tags=["profile"])

DEFAULT_SECTIONS = ["hero", "about", "skills", "projects", "contact"]

# Lowercase letters, numbers, hyphens, underscores; 3-30 chars; must start with letter/digit
USERNAME_RE = re.compile(r'^[a-z0-9][a-z0-9_-]{2,29}$')


def safe_single(table_query):
    result = table_query.limit(1).execute()
    return result.data[0] if result.data else None


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    template: Optional[str] = None
    is_public: Optional[bool] = None
    custom_domain: Optional[str] = None
    hidden_sections: Optional[list] = None


class UsernameUpdate(BaseModel):
    username: str


# ── /me/* and static paths MUST come before /{username} ──────────


@router.get("/me/data")
async def get_my_profile(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]

    profile = safe_single(supabase.table("profiles").select("*").eq("id", profile_id))
    if not profile:
        email = user.get("email", "")
        if email:
            base = email.split("@")[0].lower().replace(".", "_")[:20]
        else:
            base = profile_id.replace("_", "").lower()[-16:]
        username = base
        for suffix in range(1, 100):
            existing = safe_single(supabase.table("profiles").select("id").eq("username", username))
            if not existing:
                break
            username = f"{base}{suffix}"
        try:
            supabase.table("profiles").insert({
                "id": profile_id,
                "username": username,
                "full_name": "",
            }).execute()
        except Exception:
            pass  # Race condition — re-fetch below
        profile = safe_single(supabase.table("profiles").select("*").eq("id", profile_id))
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

    profile_id = profile["id"]
    skills         = supabase.table("skills").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    projects       = supabase.table("projects").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    socials        = supabase.table("social_links").select("*").eq("profile_id", profile_id).execute().data
    section_order_row = safe_single(supabase.table("section_order").select("*").eq("profile_id", profile_id))
    experiences    = supabase.table("experiences").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    educations     = supabase.table("educations").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    certifications = supabase.table("certifications").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    services       = supabase.table("services").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    testimonials   = supabase.table("testimonials").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    books          = supabase.table("books").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    publications   = supabase.table("publications").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    quotes         = supabase.table("quotes").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    custom_sections = supabase.table("custom_sections").select("*").eq("profile_id", profile_id).order("order_index").execute().data

    return {
        "profile": profile,
        "skills": skills,
        "projects": projects,
        "social_links": socials,
        "section_order": section_order_row["sections"] if section_order_row else DEFAULT_SECTIONS,
        "experiences": experiences,
        "educations": educations,
        "certifications": certifications,
        "services": services,
        "testimonials": testimonials,
        "books": books,
        "publications": publications,
        "quotes": quotes,
        "custom_sections": custom_sections,
    }


@router.put("/me")
async def update_my_profile(data: ProfileUpdate, user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = supabase.table("profiles").update(update_data).eq("id", profile_id).execute()
    return result.data[0] if result.data else {}


@router.patch("/me/username")
async def update_username(data: UsernameUpdate, user=Depends(get_current_user)):
    username = data.username.lower().strip()
    if not USERNAME_RE.match(username):
        raise HTTPException(
            status_code=400,
            detail="Invalid username. Use 3–30 chars: lowercase letters, numbers, _ or -"
        )
    supabase = get_supabase_client()
    profile_id = user["sub"]
    existing = safe_single(supabase.table("profiles").select("id").eq("username", username))
    if existing and existing["id"] != profile_id:
        raise HTTPException(status_code=409, detail=f"Username '{username}' is already taken")
    result = supabase.table("profiles").update({"username": username}).eq("id", profile_id).execute()
    return result.data[0] if result.data else {}


@router.get("/check-username")
async def check_username(username: str):
    username = username.lower().strip()
    if not USERNAME_RE.match(username):
        return {
            "available": False,
            "error": "Username must be 3–30 chars, lowercase letters, numbers, _ or - only",
            "suggestions": [],
        }
    supabase = get_supabase_client()
    existing = safe_single(supabase.table("profiles").select("id").eq("username", username))
    if not existing:
        return {"available": True, "suggestions": []}
    suggestions = []
    for suffix in ["1", "2", "_dev", "_hq", "dev", "official"]:
        candidate = f"{username}{suffix}"[:30]
        if USERNAME_RE.match(candidate):
            row = safe_single(supabase.table("profiles").select("id").eq("username", candidate))
            if not row:
                suggestions.append(candidate)
        if len(suggestions) >= 3:
            break
    return {"available": False, "suggestions": suggestions}


def ensure_bucket(supabase, bucket_id: str):
    try:
        supabase.storage.create_bucket(bucket_id, options={"public": True})
    except Exception:
        pass


@router.post("/me/avatar")
async def upload_avatar(file: UploadFile = File(...), user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    contents = await file.read()
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "jpg"
    path = f"{profile_id}/avatar.{ext}"
    ensure_bucket(supabase, "avatars")
    try:
        supabase.storage.from_("avatars").remove([path])
    except Exception:
        pass
    supabase.storage.from_("avatars").upload(path, contents, {"content-type": file.content_type or "image/jpeg"})
    public_url = supabase.storage.from_("avatars").get_public_url(path)
    supabase.table("profiles").update({"avatar_url": public_url}).eq("id", profile_id).execute()
    return {"avatar_url": public_url}


@router.delete("/me")
async def delete_account(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    profile = safe_single(supabase.table("profiles").select("username").eq("id", profile_id))
    if profile:
        supabase.table("page_views").delete().eq("portfolio_username", profile["username"]).execute()
    for table in ["skills", "projects", "social_links", "section_order", "subscriptions",
                  "experiences", "educations", "certifications", "services", "testimonials",
                  "books", "publications", "quotes", "custom_sections"]:
        supabase.table(table).delete().eq("profile_id", profile_id).execute()
    supabase.table("profiles").delete().eq("id", profile_id).execute()
    return {"message": "Account deleted"}


# ── /{username} MUST be last — catches all other GET paths ───────

@router.get("/{username}")
async def get_public_profile(username: str):
    supabase = get_supabase_client()
    profile_res = safe_single(
        supabase.table("profiles").select("*").eq("username", username).eq("is_public", True)
    )
    if not profile_res:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    profile = profile_res
    profile_id = profile["id"]

    skills         = supabase.table("skills").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    projects       = supabase.table("projects").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    socials        = supabase.table("social_links").select("*").eq("profile_id", profile_id).execute().data
    section_order_row = safe_single(supabase.table("section_order").select("*").eq("profile_id", profile_id))
    experiences    = supabase.table("experiences").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    educations     = supabase.table("educations").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    certifications = supabase.table("certifications").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    services       = supabase.table("services").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    testimonials   = supabase.table("testimonials").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    books          = supabase.table("books").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    publications   = supabase.table("publications").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    quotes         = supabase.table("quotes").select("*").eq("profile_id", profile_id).order("order_index").execute().data
    custom_sections = supabase.table("custom_sections").select("*").eq("profile_id", profile_id).order("order_index").execute().data

    return {
        "profile": profile,
        "skills": skills,
        "projects": projects,
        "social_links": socials,
        "section_order": section_order_row["sections"] if section_order_row else DEFAULT_SECTIONS,
        "hidden_sections": profile.get("hidden_sections") or [],
        "experiences": experiences,
        "educations": educations,
        "certifications": certifications,
        "services": services,
        "testimonials": testimonials,
        "books": books,
        "publications": publications,
        "quotes": quotes,
        "custom_sections": custom_sections,
    }
