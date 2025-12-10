from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('myevents', index),
    path('events', index),
    path('chats', index),
    path('edit/account', index),
    path('home', index),
    path('events/<int:event_id>/', index),
    path('register', index),
    path('login', index),
    path('logout', index),
    path('user', index),
    path('addevent', index),
    path('user', index),
    path('categories', index),
    path('register', index),
    path('reservations', index),
    path('account', index),
    path('events/edit/<int:event_id>/', index),
    path('user/<int:user_id>/', index),
    path('account/resetpassword/', index),
    path('chats/<int:user_id>/', index),
    path('chats', index),
]
