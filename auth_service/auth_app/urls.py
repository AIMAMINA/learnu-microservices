from django.urls import path
from auth_app.views import RegisterView, LoginView, user_profile, user_settings, change_password

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/profile/", user_profile, name="profile"),
    path("auth/settings/", user_settings, name="settings"),
    path("auth/change-password/", change_password, name="change_password"),
]
