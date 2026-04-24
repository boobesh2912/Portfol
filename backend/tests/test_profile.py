"""
Tests for the profile router: username validation, public portfolio 404, auto-create logic.
"""
import pytest
import sys, os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

os.environ.setdefault("CLERK_PUBLISHABLE_KEY", "pk_test_placeholder")
os.environ.setdefault("SUPABASE_URL", "https://placeholder.supabase.co")
os.environ.setdefault("SUPABASE_SERVICE_KEY", "placeholder")
os.environ.setdefault("SUPABASE_JWT_SECRET", "placeholder")
os.environ.setdefault("FRONTEND_URL", "http://localhost:5173")

from fastapi.testclient import TestClient
from unittest.mock import MagicMock

from main import app
from dependencies import get_current_user, get_supabase_client

FAKE_USER = {"sub": "user_test123", "email": "test@example.com", "role": "authenticated"}


def override_get_current_user():
    return FAKE_USER


app.dependency_overrides[get_current_user] = override_get_current_user


def _empty_supabase():
    """Supabase mock where all queries return no data."""
    sb = MagicMock()
    empty = MagicMock()
    empty.data = []
    sb.table.return_value.select.return_value.eq.return_value.limit.return_value.execute.return_value = empty
    sb.table.return_value.select.return_value.eq.return_value.eq.return_value.limit.return_value.execute.return_value = empty
    sb.table.return_value.insert.return_value.execute.return_value = MagicMock(data=[])
    return sb


class TestCheckUsername:

    def test_invalid_format_returns_unavailable(self):
        with TestClient(app) as client:
            resp = client.get("/api/profile/check-username?username=AB")  # uppercase + too short
        assert resp.status_code == 200
        assert resp.json()["available"] is False

    def test_valid_available_username(self):
        mock_sb = _empty_supabase()
        app.dependency_overrides[get_supabase_client] = lambda: mock_sb
        with TestClient(app) as client:
            resp = client.get("/api/profile/check-username?username=alice")
        assert resp.status_code == 200
        assert resp.json()["available"] is True

    def test_taken_username_returns_suggestions(self):
        mock_sb = MagicMock()
        # First call (exact match) → taken; subsequent calls (suggestions) → available
        taken = MagicMock(data=[{"id": "user_other"}])
        free = MagicMock(data=[])
        mock_sb.table.return_value.select.return_value.eq.return_value.limit.return_value.execute.side_effect = [
            taken, free, free, free,
        ]
        app.dependency_overrides[get_supabase_client] = lambda: mock_sb
        with TestClient(app) as client:
            resp = client.get("/api/profile/check-username?username=alice")
        assert resp.status_code == 200
        body = resp.json()
        assert body["available"] is False
        assert len(body["suggestions"]) > 0


class TestPublicPortfolio:

    def test_missing_portfolio_returns_404(self):
        mock_sb = MagicMock()
        mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(data=[])
        app.dependency_overrides[get_supabase_client] = lambda: mock_sb
        with TestClient(app) as client:
            resp = client.get("/api/profile/nobody_xyz_404")
        assert resp.status_code == 404

    def test_private_portfolio_returns_404(self):
        mock_sb = MagicMock()
        # is_public = False → the .eq("is_public", True) filter returns nothing
        mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(data=[])
        app.dependency_overrides[get_supabase_client] = lambda: mock_sb
        with TestClient(app) as client:
            resp = client.get("/api/profile/privateuser")
        assert resp.status_code == 404
