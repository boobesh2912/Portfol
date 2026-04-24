"""
Integration-style tests for the analytics router.
Uses FastAPI's TestClient with dependency overrides so no live credentials needed.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
import sys, os

# Make the backend root importable without installing as a package.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

os.environ.setdefault("CLERK_PUBLISHABLE_KEY", "pk_test_placeholder")
os.environ.setdefault("SUPABASE_URL", "https://placeholder.supabase.co")
os.environ.setdefault("SUPABASE_SERVICE_KEY", "placeholder")
os.environ.setdefault("SUPABASE_JWT_SECRET", "placeholder")
os.environ.setdefault("FRONTEND_URL", "http://localhost:5173")

from main import app
from dependencies import get_current_user, get_supabase_client


# ── Dependency overrides ──────────────────────────────────────────

FAKE_USER = {"sub": "user_test123", "email": "test@example.com", "role": "authenticated"}


def override_get_current_user():
    return FAKE_USER


def make_mock_supabase(rpc_data=None):
    sb = MagicMock()
    # Chain: .table(...).select(...).eq(...).single().execute().data
    profile_row = {"username": "testuser"}
    (sb.table.return_value.select.return_value
       .eq.return_value.single.return_value.execute.return_value.data) = profile_row
    # rpc().execute().data
    sb.rpc.return_value.execute.return_value.data = rpc_data or {
        "total_views": 42,
        "views_7d": 10,
        "views_30d": 30,
        "daily_views": [],
        "top_countries": [],
        "device_breakdown": {},
        "top_referrers": [],
    }
    return sb


app.dependency_overrides[get_current_user] = override_get_current_user


# ── Tests ──────────────────────────────────────────────────────────

class TestAnalyticsView:
    """POST /api/analytics/view"""

    def test_records_view_returns_ok(self):
        mock_sb = make_mock_supabase()
        app.dependency_overrides[get_supabase_client] = lambda: mock_sb
        with TestClient(app) as client:
            resp = client.post("/api/analytics/view", json={"username": "alice", "referrer": "https://linkedin.com"})
        assert resp.status_code == 200
        assert resp.json() == {"ok": True}

    def test_view_without_referrer_defaults_to_direct(self):
        mock_sb = make_mock_supabase()
        app.dependency_overrides[get_supabase_client] = lambda: mock_sb
        with TestClient(app) as client:
            resp = client.post("/api/analytics/view", json={"username": "bob"})
        assert resp.status_code == 200

    def test_rate_limit_enforced(self):
        """Exceeding 30 req/min from the same IP should return 429."""
        mock_sb = make_mock_supabase()
        app.dependency_overrides[get_supabase_client] = lambda: mock_sb
        with TestClient(app) as client:
            responses = [
                client.post("/api/analytics/view", json={"username": "x"})
                for _ in range(35)
            ]
        status_codes = [r.status_code for r in responses]
        assert 429 in status_codes, "Expected at least one 429 after exceeding rate limit"


class TestAnalyticsMe:
    """GET /api/analytics/me"""

    def test_returns_aggregated_data(self):
        mock_sb = make_mock_supabase(rpc_data={
            "total_views": 100,
            "views_7d": 20,
            "views_30d": 80,
            "daily_views": [{"date": "2026-04-21", "views": 5}],
            "top_countries": [{"country": "IN", "count": 40}],
            "device_breakdown": {"mobile": 60, "desktop": 40},
            "top_referrers": [{"referrer": "linkedin.com", "count": 25}],
        })
        app.dependency_overrides[get_supabase_client] = lambda: mock_sb
        with TestClient(app) as client:
            resp = client.get("/api/analytics/me")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_views"] == 100
        assert data["views_7d"] == 20
        assert len(data["top_countries"]) == 1
        assert data["top_countries"][0]["country"] == "IN"

    def test_returns_empty_when_no_profile(self):
        mock_sb = make_mock_supabase()
        mock_sb.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = None
        app.dependency_overrides[get_supabase_client] = lambda: mock_sb
        with TestClient(app) as client:
            resp = client.get("/api/analytics/me")
        assert resp.status_code == 200
        assert resp.json() == {}
