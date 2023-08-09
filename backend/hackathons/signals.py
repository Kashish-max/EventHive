import os
from django.db.models.signals import pre_delete
from django.dispatch import receiver

from backend.helpers import delete_image
from .models import Hackathon

@receiver(pre_delete, sender=Hackathon)
def delete_logo_image(sender, instance, **kwargs):
    if instance.logo:
        delete_image(instance.logo)

