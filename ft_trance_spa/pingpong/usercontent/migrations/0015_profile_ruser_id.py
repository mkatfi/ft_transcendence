# Generated by Django 5.0.4 on 2024-08-13 08:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usercontent', '0014_remove_notification_receivernotf_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='ruser_id',
            field=models.IntegerField(default=-1),
        ),
    ]
