# Generated by Django 4.2.4 on 2023-08-07 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("hackathons", "0013_alter_hackathon_submission_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="hackathon",
            name="description",
            field=models.TextField(max_length=5120),
        ),
    ]
