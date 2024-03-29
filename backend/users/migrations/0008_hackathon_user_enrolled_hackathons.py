# Generated by Django 4.0.3 on 2023-07-22 18:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_user_phone'),
    ]

    operations = [
        migrations.CreateModel(
            name='Hackathon',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_on', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=256)),
                ('description', models.TextField()),
                ('logo', models.ImageField(blank=True, null=True, upload_to='images/')),
                ('image_submission', models.ImageField(blank=True, null=True, upload_to='images/')),
                ('file_submission', models.FileField(blank=True, null=True, upload_to='files/')),
                ('link_submission', models.URLField(blank=True, null=True)),
                ('start_on', models.DateTimeField(blank=True, null=True)),
                ('end_on', models.DateTimeField(blank=True, null=True)),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-created_on',),
            },
        ),
        migrations.AddField(
            model_name='user',
            name='enrolled_hackathons',
            field=models.ManyToManyField(related_name='participants', to='users.hackathon'),
        ),
    ]
