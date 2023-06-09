from django.contrib.auth.models import AbstractUser
from django.db import models

from backend.utils.models import ChoiceArrayField
from phonenumber_field.modelfields import PhoneNumberField

class User(AbstractUser):
    
    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
        ("prefer.not.to.say", "Prefer Not To Say"),
    )

    gender = ChoiceArrayField(
        base_field=models.CharField(max_length=32, choices=GENDER_CHOICES),
        size=1,
        null=True,
        blank=True,
    )
    phone = PhoneNumberField(null=False, blank=False, unique=True)
    date_of_birth = models.DateField(null=True, blank=True)

    @property
    def friendly_name(self):
        if self.first_name:
            return self.first_name
        if self.last_name:
            return self.last_name
        return self.username