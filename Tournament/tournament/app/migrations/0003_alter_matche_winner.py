# Generated by Django 5.0.6 on 2024-07-30 10:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_matche_p1_score_matche_p2_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='matche',
            name='winner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='m_win', to='app.player'),
        ),
    ]
