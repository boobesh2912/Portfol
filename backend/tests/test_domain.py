"""
Tests for domain verification logic.
The CNAME verification function is pure enough to test directly
without mocking the entire DNS stack — we patch dns.resolver.Resolver.
"""
import pytest
import sys, os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

os.environ.setdefault("CLERK_PUBLISHABLE_KEY", "pk_test_placeholder")
os.environ.setdefault("SUPABASE_URL", "https://placeholder.supabase.co")
os.environ.setdefault("SUPABASE_SERVICE_KEY", "placeholder")
os.environ.setdefault("SUPABASE_JWT_SECRET", "placeholder")
os.environ.setdefault("FRONTEND_URL", "http://localhost:5173")

from unittest.mock import MagicMock, patch
import dns.rdtypes.ANY.CNAME
import dns.name

from routers.domain import _verify_cname, VIZHVA_CNAME_TARGET


def _make_cname_answer(target: str):
    """Build a minimal dns.resolver.Answer-like mock for a CNAME record."""
    rdata = MagicMock()
    rdata.target = dns.name.from_text(target)
    return [rdata]


class TestVerifyCname:

    def test_direct_cname_match(self):
        with patch("routers.domain.dns.resolver.Resolver") as MockResolver:
            instance = MockResolver.return_value
            instance.resolve.return_value = _make_cname_answer(VIZHVA_CNAME_TARGET + ".")
            assert _verify_cname("mycustom.example.com") is True

    def test_cname_with_trailing_dot(self):
        # DNS names often include a trailing dot — should still match.
        with patch("routers.domain.dns.resolver.Resolver") as MockResolver:
            instance = MockResolver.return_value
            instance.resolve.return_value = _make_cname_answer("vizhva.me.")
            assert _verify_cname("mysite.com") is True

    def test_cname_pointing_elsewhere_fails(self):
        with patch("routers.domain.dns.resolver.Resolver") as MockResolver:
            instance = MockResolver.return_value
            instance.resolve.return_value = _make_cname_answer("other-host.com.")
            assert _verify_cname("mysite.com") is False

    def test_no_cname_record_returns_false(self):
        import dns.resolver
        with patch("routers.domain.dns.resolver.Resolver") as MockResolver:
            instance = MockResolver.return_value
            instance.resolve.side_effect = dns.resolver.NoAnswer
            assert _verify_cname("mysite.com") is False

    def test_nxdomain_returns_false(self):
        import dns.resolver
        with patch("routers.domain.dns.resolver.Resolver") as MockResolver:
            instance = MockResolver.return_value
            instance.resolve.side_effect = dns.resolver.NXDOMAIN
            assert _verify_cname("nonexistent.example.com") is False

    def test_generic_dns_exception_returns_false(self):
        with patch("routers.domain.dns.resolver.Resolver") as MockResolver:
            instance = MockResolver.return_value
            instance.resolve.side_effect = Exception("timeout")
            assert _verify_cname("mysite.com") is False
