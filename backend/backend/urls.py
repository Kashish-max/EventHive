from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import SimpleRouter

urlpatterns = [
    path("admin/", admin.site.urls),

    # include urls
    path("auth/", include('authentication.urls')),
    path("users/", include('users.urls')),
    path("hackathons/", include('hackathons.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)