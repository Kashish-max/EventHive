import re
from rest_framework import serializers
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth import get_user_model

User = get_user_model()

class SignupSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    username = serializers.CharField(max_length=30)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30, required=False)
    phone= PhoneNumberField()
    date_of_birth = serializers.DateField()
    gender = serializers.ListField(child=serializers.ChoiceField(choices=User.GENDER_CHOICES))

    class Meta:
        model = User
        fields = ('email', 'password', 'username', 'first_name', 'last_name', 'date_of_birth', 'gender', 'phone')

    def validate_password(self, value):
        # Add any custom password validation rules here
        if not re.search('\d', value):
            raise serializers.ValidationError("The password must contain at least one digit.")
        if not re.search('[A-Z]', value):
            raise serializers.ValidationError("The password must contain at least one uppercase letter.")
        if not re.search('[a-z]', value):
            raise serializers.ValidationError("The password must contain at least one lowercase letter.")
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()