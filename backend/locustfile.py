from locust import HttpUser, task, between
import json
import random

class PortfolioUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        # Test token for authenticated requests
        self.token = "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Imluc18yWjN5R3pXTk5pR3pHVGJ5R3pXTk5pR3pIiwidHlwIjoiSldUIn0.eyJhenAiOiJwa19fdGVzdF96ZGVjZW50LXBhbnRoZXItNC5jbGVyay5hY2NvdW50cy5kZXYkIiwiaWF0IjoxNzM3NjU2OTY5LCJleHAiOjE3Mzc2NjA1NjksImlzcyI6Imh0dHBzOi8vY2xlcmsuZGVjZW50LXBhbnRoZXItNC5jbGVyay5hY2NvdW50cy5kZXYkIiwibmJmIjoxNzM3NjU2OTY5LCJzdWIiOiJ1c2VyXzJ6M0x5R3pXTk5pR3pHVGJ5R3pXTk5pR3oiLCJzaWQiOiJzZXNzXzJ6M0x5R3pXTk5pR3pHVGJ5R3pXTk5pR3oiLCJ1c2VyX2lkIjoidXNlcl8yejNMeUd6V055cUd6SFRCeUd6V055cUd6SCJ9.test_token_placeholder"

    @task(3)
    def record_view(self):
        # Simulate viewing a portfolio
        usernames = ["testuser1", "testuser2", "demo", "portfolio"]
        username = random.choice(usernames)
        self.client.post("/api/analytics/view", json={"username": username})

    @task(2)
    def check_domain(self):
        # Simulate domain check
        domains = ["test.com", "example.com", "portfolio.com"]
        domain = random.choice(domains)
        self.client.get(f"/api/domain/check?domain={domain}")

    @task(1)
    def get_analytics(self):
        # Authenticated: get my analytics
        headers = {"Authorization": self.token}
        self.client.get("/api/analytics/me", headers=headers)

    @task(1)
    def get_profile(self):
        # Authenticated: get profile
        headers = {"Authorization": self.token}
        self.client.get("/api/profile/me", headers=headers)

    @task(1)
    def create_checkout(self):
        # Authenticated: create payment checkout
        headers = {"Authorization": self.token}
        self.client.post("/api/billing/create-checkout", json={"success_url": "http://localhost:5173/success", "cancel_url": "http://localhost:5173/cancel"}, headers=headers)