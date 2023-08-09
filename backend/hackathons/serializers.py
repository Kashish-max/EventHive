from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Hackathon, Enrollment

class HackathonSerializer(serializers.ModelSerializer):
    # host = serializers.SerializerMethodField()

    class Meta:
        model = Hackathon
        fields = '__all__'

    # def get_host(self, obj):
    #     host = obj.host
    #     if host:
    #         return UserSerializer(host).data
    #     return None


class EnrollmentSerializer(serializers.ModelSerializer):
    # user = serializers.SerializerMethodField()
    hackathon = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = '__all__'

    # def get_user(self, obj):
    #     user = obj.user
    #     if user:
    #         return UserSerializer(user).data
    #     return None
    
    def get_hackathon(self, obj):
        hackathon = obj.hackathon
        if hackathon:
            return HackathonSerializer(hackathon, context=self.context).data
        return None
