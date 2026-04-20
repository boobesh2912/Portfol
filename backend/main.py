from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routers import profile, projects, sections, analytics, domain, billing, skills

app = FastAPI(title="Portfol API", version="1.0.0")

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")

# Support comma-separated FRONTEND_URL list for multiple origins (e.g. "https://a.netlify.app,https://yourdomain.com")
_allowed_origins = [o.strip() for o in frontend_url.split(",") if o.strip()]
_allowed_origins += ["http://localhost:5173", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(_allowed_origins)),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile.router)
app.include_router(projects.router)
app.include_router(sections.router)
app.include_router(analytics.router)
app.include_router(domain.router)
app.include_router(billing.router)
app.include_router(skills.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "portfol-api"}
