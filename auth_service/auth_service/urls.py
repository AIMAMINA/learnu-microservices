from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    # auth_app.urls already starts with "auth/": /auth/login/, /auth/register/...
    path("", include("auth_app.urls")),
]
