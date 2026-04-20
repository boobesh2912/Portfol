from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import Optional, List
from pydantic import BaseModel
import uuid
from dependencies import get_current_user, get_supabase_client

router = APIRouter(prefix="/api/projects", tags=["projects"])


class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    order_index: Optional[int] = 0


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    order_index: Optional[int] = None


class ReorderItem(BaseModel):
    id: str
    order_index: int


@router.get("")
async def list_projects(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    result = supabase.table("projects").select("*").eq("profile_id", user["sub"]).order("order_index").execute()
    return result.data


@router.post("")
async def create_project(data: ProjectCreate, user=Depends(get_current_user)):
    supabase = get_supabase_client()
    project = {
        "id": str(uuid.uuid4()),
        "profile_id": user["sub"],
        "title": data.title,
        "description": data.description,
        "url": data.url,
        "order_index": data.order_index,
    }
    result = supabase.table("projects").insert(project).execute()
    return result.data[0]


@router.put("/reorder")
async def reorder_projects(items: List[ReorderItem], user=Depends(get_current_user)):
    supabase = get_supabase_client()
    for item in items:
        supabase.table("projects").update({"order_index": item.order_index}).eq("id", item.id).eq("profile_id", user["sub"]).execute()
    return {"message": "Reordered"}


@router.put("/{project_id}")
async def update_project(project_id: str, data: ProjectUpdate, user=Depends(get_current_user)):
    supabase = get_supabase_client()
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = supabase.table("projects").update(update_data).eq("id", project_id).eq("profile_id", user["sub"]).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return result.data[0]


@router.delete("/{project_id}")
async def delete_project(project_id: str, user=Depends(get_current_user)):
    supabase = get_supabase_client()
    supabase.table("projects").delete().eq("id", project_id).eq("profile_id", user["sub"]).execute()
    return {"message": "Deleted"}


@router.post("/{project_id}/image")
async def upload_project_image(project_id: str, file: UploadFile = File(...), user=Depends(get_current_user)):
    supabase = get_supabase_client()
    contents = await file.read()
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "jpg"
    path = f"{user['sub']}/{project_id}.{ext}"
    # Auto-create bucket if missing
    try:
        supabase.storage.create_bucket("project-images", options={"public": True})
    except Exception:
        pass
    try:
        supabase.storage.from_("project-images").remove([path])
    except Exception:
        pass
    supabase.storage.from_("project-images").upload(path, contents)
    public_url = supabase.storage.from_("project-images").get_public_url(path)
    supabase.table("projects").update({"image_url": public_url}).eq("id", project_id).eq("profile_id", user["sub"]).execute()
    return {"image_url": public_url}
