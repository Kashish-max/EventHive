# Generated by Django 4.0.3 on 2023-07-24 06:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0014_alter_hackathon_logo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hackathon',
            name='logo',
            field=models.ImageField(blank=True, null=True, upload_to='logos/'),
        ),
    ]
