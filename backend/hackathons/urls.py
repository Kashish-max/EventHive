from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HackathonViewSet, 
    HackathonEnrollmentsAPIView, 
    UserEnrollmentsAPIView, 
    UserListingsAPIView, 
    EnrollmentAPIView,
    SubmissionAPIView,
)

router = DefaultRouter()
router.register(r'', HackathonViewSet, basename="")

urlpatterns = [
    path('list/', include(router.urls)),
    path('<uuid:hackathon_id>/enrollments/', HackathonEnrollmentsAPIView.as_view(), name='enrollments'),
    path('my-enrollments/', UserEnrollmentsAPIView.as_view(), name='my-enrollments'),
    path('my-listings/', UserListingsAPIView.as_view(), name='my-listings'), 
    path('enroll/', EnrollmentAPIView.as_view(), name='enroll'),
    path('submit/', SubmissionAPIView.as_view(), name='submit'),
]