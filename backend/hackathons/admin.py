from django.contrib import admin
from .models import Hackathon, Enrollment

class HackaThonAdmin(admin.ModelAdmin):
    list_display = ('title', 'host', 'start_on', 'end_on')

class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'hackathon', 'applied_on')

admin.site.register(Hackathon, HackaThonAdmin)
admin.site.register(Enrollment, EnrollmentAdmin)
