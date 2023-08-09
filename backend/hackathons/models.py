import uuid
from django.utils import timezone
from django.db import models
from django.contrib.auth import get_user_model

from backend.utils.models import ChoiceArrayField

User = get_user_model()


SUBMISSION_TYPE_CHOICES = (
    ("image", "Image"),
    ("file", "File"),
    ("link", "Link"),
)

class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_on = models.DateTimeField(db_index=True, default=timezone.now)
    updated_on = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Hackathon(BaseModel):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=256, unique=True)
    description = models.TextField(max_length=10240)
    host_display_name = models.CharField(max_length=50)
    logo = models.FileField(upload_to='logos/', blank=True, null=True)
    reward = models.IntegerField(null=True, blank=True)
    submission_type = ChoiceArrayField(
        base_field=models.CharField(max_length=32, choices=SUBMISSION_TYPE_CHOICES),
        size=1,
    )

    start_on = models.DateTimeField(blank=True, null=True)
    end_on = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ("-created_on",)
        

class Enrollment(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hackathon = models.ForeignKey(Hackathon, on_delete=models.CASCADE)

    image_submission = models.FileField(upload_to='submission_images/', default=None, blank=True, null=True)
    file_submission = models.FileField(upload_to='submission_files/', default=None, blank=True, null=True)
    link_submission = models.URLField(max_length=200, default=None, blank=True, null=True)
    submission_type = ChoiceArrayField(
        base_field=models.CharField(max_length=32, choices=SUBMISSION_TYPE_CHOICES),
        size=1,
        null=True,
        blank=True,
    )

    applied_on = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = (("user", "hackathon"),)