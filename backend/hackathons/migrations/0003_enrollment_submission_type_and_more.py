# Generated by Django 4.0.3 on 2023-07-24 10:24

import backend.utils.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hackathons', '0002_alter_enrollment_hackathon'),
    ]

    operations = [
        migrations.AddField(
            model_name='enrollment',
            name='submission_type',
            field=backend.utils.models.ChoiceArrayField(base_field=models.CharField(choices=[('image', 'Image'), ('file', 'File'), ('link', 'Link')], max_length=32), blank=True, null=True, size=1),
        ),
        migrations.AlterField(
            model_name='enrollment',
            name='hackathon',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hackathons.hackathon'),
        ),
    ]
