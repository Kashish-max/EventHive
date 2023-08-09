import os
from rest_framework.views import APIView
from rest_framework import viewsets, status, serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response

from .models import Hackathon, Enrollment
from .serializers import EnrollmentSerializer, HackathonSerializer
from users.models import User


class HackathonViewSet(viewsets.ModelViewSet):
    queryset = Hackathon.objects.all()
    serializer_class = HackathonSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Hackathon.objects.all()   

    def create(self, request, *args, **kwargs):
        request.data['host'] = request.user.pk
        try:
            logo_file = request.FILES.get('logo', None)
            if logo_file:
                # Customize the file name
                file_name, file_extension = os.path.splitext(logo_file.name)
                customized_file_name = request.data["title"].lower().replace(' ','-') + file_extension
                logo_file.name = customized_file_name    
            return super().create(request, *args, **kwargs)
        except Exception as e:
            try:
                request.data['logo'] = None
                return super().create(request, *args, **kwargs)                
            except Exception as e:
                pass
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_destroy(self, instance):
        # Check if the request user is the host of the Hackathon being deleted.
        if self.request.user != instance.host:
            # Raise a permission denied exception if the user is not the host.
            raise PermissionDenied("You are not allowed to delete this Hackathon.")
        instance.delete()

    def get_permissions(self):
        if self.action == 'list':
            return []
        return [IsAuthenticated()]
    

class HackathonEnrollmentsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        hackathon_id = self.kwargs.get('hackathon_id')

        try:
            hackathon = Hackathon.objects.get(pk=hackathon_id)
        except Hackathon.DoesNotExist:
            return Response({'error': 'Hackathon not found.'}, status=status.HTTP_404_NOT_FOUND)

        enrollments = Enrollment.objects.filter(hackathon=hackathon)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserEnrollmentsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get all enrollments the user is enrolled in.
        enrollments = Enrollment.objects.filter(user=request.user)

        # Serialize the enrollments data to return in the response.
        serializer = EnrollmentSerializer(enrollments, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UserListingsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
     
    def get(self, request, *args, **kwargs):
        # Get all hackathons the user is hosting.
        hackathons = Hackathon.objects.filter(host=request.user)

        # Serialize the enrollments data to return in the response.
        serializer = HackathonSerializer(hackathons, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)  
    

class EnrollmentAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    class InputSerializer(serializers.Serializer):
        hackathon = serializers.UUIDField()

    def post(self, request, *args, **kwargs):

        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user
        try:
            hackathon = Hackathon.objects.get(id=data['hackathon'])
        except Hackathon.DoesNotExist:
            return Response({'error': 'Hackathon not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user has already enrolled in this hackathon.
        if Enrollment.objects.filter(user=user, hackathon=hackathon).exists():
            return Response({'error': 'User already enrolled in this hackathon.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new enrollment for the user and hackathon.
        enrollment = Enrollment(user=user, hackathon=hackathon, submission_type=hackathon.submission_type)
        enrollment.save()

        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class SubmissionAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    class InputSerializer(serializers.Serializer):
        hackathon = serializers.UUIDField()
        image_submission = serializers.ImageField(required=False)
        text_submission = serializers.CharField(required=False)
        link_submission = serializers.URLField(required=False)

    def post(self, request, *args, **kwargs):

        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user

        try:
            hackathon = Hackathon.objects.get(id=data['hackathon'])
        except Hackathon.DoesNotExist:
            return Response({'error': 'Hackathon not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            enrollment = Enrollment.objects.get(user=user, hackathon=hackathon)
        except Enrollment.DoesNotExist:
            return Response({'error': 'Enrollment not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check only submission based on the enrollment's submission type.
        submission_type = enrollment.submission_type[0]
        submission_field = submission_type + '_submission'
        default_submission = getattr(enrollment, submission_field, None)

        # Check if the user has already submitted to this hackathon.
        if((default_submission is not None) and (default_submission != '')):
            return Response({'error': 'User already submitted to this hackathon.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # submission_file = data.get(submission_field)
            submission_file = request.FILES.get((submission_field), None)
            if(submission_file is None):
                return Response({'error': 'Invalid submission type.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': e}, status=status.HTTP_400_BAD_REQUEST)

        # Update the enrollment for the user and hackathon.
        # Customize the file name
        if submission_file:
            file_name, file_extension = os.path.splitext(submission_file.name)
            customized_file_name = hackathon.title.lower().replace(' ','-') + file_extension
            submission_file.name = customized_file_name
            setattr(enrollment, submission_field, submission_file)
            enrollment.save()
        else:
            return Response({'error': 'Submission file not found.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = EnrollmentSerializer(enrollment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)