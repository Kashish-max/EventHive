from django.apps import AppConfig


class HackathonsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'hackathons'

    def ready(self):
        try:
            import hackathons.signals
        except ImportError:
            pass