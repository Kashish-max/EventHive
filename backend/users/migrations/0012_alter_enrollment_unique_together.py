# Generated by Django 4.0.3 on 2023-07-23 14:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_alter_enrollment_unique_together'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='enrollment',
            unique_together={('user', 'hackathon')},
        ),
    ]
