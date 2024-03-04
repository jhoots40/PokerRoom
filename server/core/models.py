from django.contrib.auth.models import AbstractUser
from django.db import models

class Room(models.Model):
    entry_code = models.IntegerField(unique=True)

    def __str__(self):
        return str(self.entry_code)

class CustomUser(AbstractUser):
    # Add custom fields here
    age = models.PositiveIntegerField(blank=True, null=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='users', null=True, blank=True)

    class Meta:
        # Provide a unique related name for the groups field
        # You can choose any name that makes sense for your project
        # For example, 'customuser_groups'
        db_table = 'user'
        managed = True
        ordering = ['id']

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='customuser_groups',
        related_query_name='user',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='customuser_user_permissions',
        related_query_name='user',
    )

    def __str__(self):
        return self.username
