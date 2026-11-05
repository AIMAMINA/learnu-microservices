import jwt
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.test import APITestCase

PASSWORD = "Str0ng-Passw0rd!"


class AuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user("AMINA", "amina@example.com", PASSWORD)

    def login(self, identifier, password=PASSWORD):
        return self.client.post("/auth/login/", {"username": identifier, "password": password}, format="json")

    def test_login_ignores_username_case_and_accepts_email(self):
        for identifier in ("AMINA", "amina", "Amina", "AMINA@example.com"):
            self.assertEqual(self.login(identifier).status_code, 200, identifier)
        self.assertEqual(self.login("AMINA", "wrong").status_code, 401)
        self.assertEqual(self.login("ghost").status_code, 401)

    def test_token_carries_username_for_the_gateway(self):
        token = self.login("amina").data["access"]
        claims = jwt.decode(token, settings.SIMPLE_JWT["SIGNING_KEY"], algorithms=["HS256"])
        self.assertEqual(claims["username"], "AMINA")
        self.assertEqual(claims["token_type"], "access")

    def test_register_rules(self):
        weak = self.client.post("/auth/register/", {"username": "x", "email": "x@example.com", "password": "12345678"}, format="json")
        self.assertEqual(weak.status_code, 400)
        same_name = self.client.post("/auth/register/", {"username": "amina", "email": "b@example.com", "password": PASSWORD}, format="json")
        self.assertEqual(same_name.status_code, 400)
        ok = self.client.post("/auth/register/", {"username": "sara", "email": "sara@example.com", "password": PASSWORD}, format="json")
        self.assertEqual(ok.status_code, 201)

    def test_settings_are_saved(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.get("/auth/settings/").data["dark_mode"], False)
        self.client.put("/auth/settings/", {"dark_mode": True}, format="json")
        self.assertEqual(self.client.get("/auth/settings/").data["dark_mode"], True)

    def test_change_password_needs_current_password(self):
        self.client.force_authenticate(self.user)
        url = "/auth/change-password/"
        self.assertEqual(self.client.post(url, {"password": "N3w-Passw0rd!"}, format="json").status_code, 400)
        self.assertEqual(self.client.post(url, {"current_password": "wrong", "password": "N3w-Passw0rd!"}, format="json").status_code, 400)
        self.assertEqual(self.client.post(url, {"current_password": PASSWORD, "password": "123"}, format="json").status_code, 400)
        self.assertEqual(self.client.post(url, {"current_password": PASSWORD, "password": "N3w-Passw0rd!"}, format="json").status_code, 200)
        self.client.force_authenticate(None)
        self.assertEqual(self.login("amina", "N3w-Passw0rd!").status_code, 200)
