# Generated by Django 4.1.13 on 2024-03-03 16:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_remove_room_players_customuser_room'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='room',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='core.room'),
        ),
    ]
