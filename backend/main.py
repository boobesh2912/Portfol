from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os

load_dotenv()

from routers import profile, projects, sections, analytics, domain, billing, skills

limiter = Limiter(key_func=get_remote_address, default_limits=[])

app = FastAPI(title="Vizhva API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")

# Support comma-separated FRONTEND_URL list
_explicit = [o.strip() for o in frontend_url.split(",") if o.strip()]
_allowed_origins = list(set(_explicit + ["http://localhost:5173", "http://localhost:3000"]))

# If ALLOW_ALL_ORIGINS=true is set, use wildcard (useful during initial deploy)
_allow_all = os.environ.get("ALLOW_ALL_ORIGINS", "false").lower() == "true"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if _allow_all else _allowed_origins,
    allow_credentials=False if _allow_all else True,
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
    return {"status": "ok", "service": "vizhva-api"}
