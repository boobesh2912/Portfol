from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional, Any
from pydantic import BaseModel
from dependencies import get_current_user, get_supabase_client
import uuid

router = APIRouter(prefix="/api/sections", tags=["sections"])


class SectionOrderUpdate(BaseModel):
    sections: List[str]

class SectionVisibilityUpdate(BaseModel):
    hidden_sections: List[str]

class SectionSettingsUpdate(BaseModel):
    section: str
    settings: dict

class ExperienceItem(BaseModel):
    id: Optional[str] = None
    role: str
    company: str
    period: Optional[str] = None
    description: Optional[str] = None
    order_index: Optional[int] = 0

class EducationItem(BaseModel):
    id: Optional[str] = None
    degree: str
    institution: str
    period: Optional[str] = None
    description: Optional[str] = None
    order_index: Optional[int] = 0

class CertificationItem(BaseModel):
    id: Optional[str] = None
    name: str
    issuer: Optional[str] = None
    year: Optional[str] = None
    url: Optional[str] = None
    order_index: Optional[int] = 0

class ServiceItem(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = None
    icon: Optional[str] = "⚡"
    order_index: Optional[int] = 0

class TestimonialItem(BaseModel):
    id: Optional[str] = None
    name: str
    role: Optional[str] = None
    text: str
    avatar_url: Optional[str] = None
    order_index: Optional[int] = 0

class BookItem(BaseModel):
    id: Optional[str] = None
    title: str
    author: Optional[str] = None
    year: Optional[str] = None
    url: Optional[str] = None
    notes: Optional[str] = None
    order_index: Optional[int] = 0

class PublicationItem(BaseModel):
    id: Optional[str] = None
    title: str
    publisher: Optional[str] = None
    year: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None
    order_index: Optional[int] = 0

class QuoteItem(BaseModel):
    id: Optional[str] = None
    text: str
    author: Optional[str] = None
    order_index: Optional[int] = 0

class CustomSectionItem(BaseModel):
    id: Optional[str] = None
    section_key: str          # e.g. "my_custom"
    section_label: str        # e.g. "My Custom Section"
    content: Optional[str] = None  # Rich text / markdown
    items: Optional[Any] = None    # Flexible list
    order_index: Optional[int] = 0

class ProfileExtrasUpdate(BaseModel):
    location: Optional[str] = None
    email_public: Optional[str] = None
    phone: Optional[str] = None
    languages: Optional[List[str]] = None
    hobbies: Optional[List[str]] = None
    stats: Optional[Any] = None
    open_source: Optional[List[str]] = None
    writing_links: Optional[Any] = None
    available_for: Optional[List[str]] = None


# ── Section order / visibility / settings ──────────────────────

@router.put("/order")
async def update_section_order(data: SectionOrderUpdate, user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    result = supabase.table("section_order").select("profile_id").eq("profile_id", profile_id).limit(1).execute()
    if result.data:
        supabase.table("section_order").update({"sections": data.sections}).eq("profile_id", profile_id).execute()
    else:
        supabase.table("section_order").insert({"profile_id": profile_id, "sections": data.sections}).execute()
    return {"sections": data.sections}


@router.put("/visibility")
async def update_section_visibility(data: SectionVisibilityUpdate, user=Depends(get_current_user)):
    supabase = get_supabase_client()
    supabase.table("profiles").update({"hidden_sections": data.hidden_sections}).eq("id", user["sub"]).execute()
    return {"hidden_sections": data.hidden_sections}


@router.put("/settings")
async def update_section_settings(data: SectionSettingsUpdate, user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    existing = supabase.table("profiles").select("section_settings").eq("id", profile_id).limit(1).execute()
    current = (existing.data[0].get("section_settings") or {}) if existing.data else {}
    current[data.section] = data.settings
    supabase.table("profiles").update({"section_settings": current}).eq("id", profile_id).execute()
    return current


# ── Profile extras ─────────────────────────────────────────────

@router.put("/extras")
async def update_profile_extras(data: ProfileExtrasUpdate, user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields")
    result = supabase.table("profiles").update(update_data).eq("id", profile_id).execute()
    return result.data[0] if result.data else {}


# ── Generic upsert helper ───────────────────────────────────────

def _upsert(supabase, table: str, profile_id: str, rows: list):
    supabase.table(table).delete().eq("profile_id", profile_id).execute()
    if rows:
        supabase.table(table).insert(rows).execute()
    return rows


# ── Experience ─────────────────────────────────────────────────

@router.get("/experience")
async def get_experience(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    return supabase.table("experiences").select("*").eq("profile_id", user["sub"]).order("order_index").execute().data

@router.put("/experience")
async def upsert_experience(items: List[ExperienceItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    rows = [{"id": it.id or str(uuid.uuid4()), "profile_id": profile_id, "role": it.role, "company": it.company, "period": it.period, "description": it.description, "order_index": i} for i, it in enumerate(items)]
    return _upsert(supabase, "experiences", profile_id, rows)


# ── Education ──────────────────────────────────────────────────

@router.get("/education")
async def get_education(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    return supabase.table("educations").select("*").eq("profile_id", user["sub"]).order("order_index").execute().data

@router.put("/education")
async def upsert_education(items: List[EducationItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    rows = [{"id": it.id or str(uuid.uuid4()), "profile_id": profile_id, "degree": it.degree, "institution": it.institution, "period": it.period, "description": it.description, "order_index": i} for i, it in enumerate(items)]
    return _upsert(supabase, "educations", profile_id, rows)


# ── Certifications ─────────────────────────────────────────────

@router.put("/certifications")
async def upsert_certifications(items: List[CertificationItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    rows = [{"id": it.id or str(uuid.uuid4()), "profile_id": profile_id, "name": it.name, "issuer": it.issuer, "year": it.year, "url": it.url, "order_index": i} for i, it in enumerate(items)]
    return _upsert(supabase, "certifications", profile_id, rows)


# ── Services ───────────────────────────────────────────────────

@router.put("/services")
async def upsert_services(items: List[ServiceItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    rows = [{"id": it.id or str(uuid.uuid4()), "profile_id": profile_id, "title": it.title, "description": it.description, "icon": it.icon, "order_index": i} for i, it in enumerate(items)]
    return _upsert(supabase, "services", profile_id, rows)


# ── Testimonials ───────────────────────────────────────────────

@router.put("/testimonials")
async def upsert_testimonials(items: List[TestimonialItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    rows = [{"id": it.id or str(uuid.uuid4()), "profile_id": profile_id, "name": it.name, "role": it.role, "text": it.text, "avatar_url": it.avatar_url, "order_index": i} for i, it in enumerate(items)]
    return _upsert(supabase, "testimonials", profile_id, rows)


# ── Books ──────────────────────────────────────────────────────

@router.put("/books")
async def upsert_books(items: List[BookItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    rows = [{"id": it.id or str(uuid.uuid4()), "profile_id": profile_id, "title": it.title, "author": it.author, "year": it.year, "url": it.url, "notes": it.notes, "order_index": i} for i, it in enumerate(items)]
    return _upsert(supabase, "books", profile_id, rows)


# ── Publications ───────────────────────────────────────────────

@router.put("/publications")
async def upsert_publications(items: List[PublicationItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    rows = [{"id": it.id or str(uuid.uuid4()), "profile_id": profile_id, "title": it.title, "publisher": it.publisher, "year": it.year, "url": it.url, "description": it.description, "order_index": i} for i, it in enumerate(items)]
    return _upsert(supabase, "publications", profile_id, rows)


# ── Quotes ─────────────────────────────────────────────────────

@router.put("/quotes")
async def upsert_quotes(items: List[QuoteItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    rows = [{"id": it.id or str(uuid.uuid4()), "profile_id": profile_id, "text": it.text, "author": it.author, "order_index": i} for i, it in enumerate(items)]
    return _upsert(supabase, "quotes", profile_id, rows)


# ── Custom Sections ────────────────────────────────────────────

@router.put("/custom")
async def upsert_custom_sections(items: List[CustomSectionItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    profile_id = user["sub"]
    rows = [{"id": it.id or str(uuid.uuid4()), "profile_id": profile_id, "section_key": it.section_key, "section_label": it.section_label, "content": it.content, "items": it.items, "order_index": i} for i, it in enumerate(items)]
    return _upsert(supabase, "custom_sections", profile_id, rows)
