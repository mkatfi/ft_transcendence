# Generated by Django 3.1 on 2024-07-21 15:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('online', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='ingame',
            name='gid',
            field=models.IntegerField(default=-1, verbose_name='gid'),
        ),
        migrations.AddField(
            model_name='ingame',
            name='type',
            field=models.CharField(default='normal', max_length=20, verbose_name='type'),
        ),
    ]
