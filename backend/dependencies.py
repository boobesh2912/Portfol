from fastapi import HTTPException, Header
from typing import Optional
import os
import httpx
import jwt
from jwt import PyJWKClient
from supabase import create_client, Client
import redis
import logging

logger = logging.getLogger(__name__)

_supabase_client: Optional[Client] = None
_jwks_client: Optional[PyJWKClient] = None
_redis_client: Optional[redis.Redis] = None


def get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client is None:
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_KEY"]
        _supabase_client = create_client(url, key)
    return _supabase_client


def get_redis_client() -> Optional[redis.Redis]:
    global _redis_client
    if _redis_client is None:
        redis_url = os.environ.get("REDIS_URL")
        if redis_url:
            try:
                _redis_client = redis.from_url(redis_url)
                logger.info("Redis client initialized")
            except Exception as e:
                logger.warning(f"Failed to connect to Redis: {e}")
    return _redis_client


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        # Clerk publishes JWKS at this URL — uses your Frontend API (issuer domain)
        clerk_jwks_url = os.environ.get("CLERK_JWKS_URL", "")
        if not clerk_jwks_url:
            # Auto-derive from publishable key: pk_live_xxx → yyy.clerk.accounts.dev
            pk = os.environ.get("CLERK_PUBLISHABLE_KEY", "")
            if pk.startswith("pk_live_") or pk.startswith("pk_test_"):
                import base64
                # The publishable key encodes the frontend API domain after the prefix
                raw = pk.split("_", 2)[-1]
                # Pad base64 and decode
                padded = raw + "=" * (-len(raw) % 4)
                try:
                    domain = base64.b64decode(padded).decode().rstrip("$")
                    clerk_jwks_url = f"https://{domain}/.well-known/jwks.json"
                except Exception:
                    pass
        if not clerk_jwks_url:
            raise RuntimeError(
                "Set CLERK_JWKS_URL or CLERK_PUBLISHABLE_KEY in environment"
            )
        _jwks_client = PyJWKClient(clerk_jwks_url, cache_keys=True)
    return _jwks_client


async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.removeprefix("Bearer ").strip()
    try:
        jwks = _get_jwks_client()
        signing_key = jwks.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_exp": True},
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing sub")
        return {
            "sub": user_id,
            "email": payload.get("email", ""),
            "role": "authenticated",
        }
    except HTTPException:
        raise
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {e}")
