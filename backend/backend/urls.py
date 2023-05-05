from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # include urls
    path("auth/", include('authentication.urls')),
    path("users/", include('users.urls')),
]