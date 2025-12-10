from django.db import models
from django.utils.datetime_safe import date
from django.contrib.auth.models import User

# models.py
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.datetime_safe import date
from django.utils import timezone

class Organizators(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='organizator_profile')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
class Admin(models.Model):
    login = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Categories(models.Model):
    name = models.CharField(max_length=45)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Events(models.Model):
    name = models.CharField(max_length=45)
    description = models.TextField(max_length=200)
    start_datetime = models.DateTimeField(default=timezone.now)
    end_datetime = models.DateTimeField(default=timezone.now)
    address = models.CharField(max_length=100)
    category = models.ForeignKey(Categories, on_delete=models.CASCADE)
    organizator = models.ForeignKey(Organizators, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    totalSlots = models.PositiveIntegerField(default=0)
    slots_number = models.PositiveIntegerField(default=0)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)


class Reservations(models.Model):
    slots_number = models.PositiveIntegerField(default=1)
    creation_date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Events, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Opinions(models.Model):
    text = models.TextField(max_length=300)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_opinions',  # Użytkownik posiadający opinie
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='authored_opinions',  # Autor opinii
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



class Conversations(models.Model):
    name = models.CharField(max_length=45)
    creation_date = models.DateField()
    organizator = models.ForeignKey(Organizators, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Messages(models.Model):
    text = models.TextField(max_length=300)
    timestamp = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sender',
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='receiver',
    )

    updated_at = models.DateTimeField(auto_now=True)

class UserCategories(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Categories, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

