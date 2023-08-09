# Generated by Django 4.0.3 on 2023-07-27 12:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hackathons', '0006_alter_enrollment_file_submission_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='enrollment',
            name='file_submission',
            field=models.FileField(default=None, upload_to='submission_files/'),
        ),
        migrations.AlterField(
            model_name='enrollment',
            name='image_submission',
            field=models.FileField(default=None, upload_to='submission_images/'),
        ),
        migrations.AlterField(
            model_name='enrollment',
            name='link_submission',
            field=models.URLField(default=None),
        ),
    ]
