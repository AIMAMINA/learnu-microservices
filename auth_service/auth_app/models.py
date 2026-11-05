from django.conf import settings
from django.db import models


class UserSettings(models.Model):
    """Preferences saved per account (they used to be lost on every save)."""

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="preferences")
    dark_mode = models.BooleanField(default=False)
    notifications = models.BooleanField(default=True)

    def __str__(self):
        return f"Settings of {self.user.username}"
