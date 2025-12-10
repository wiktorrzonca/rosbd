from django.contrib import admin
from .models import Admin, Events, Categories, Organizators, Messages, Opinions, Reservations, UserCategories, Conversations

# Rejestracja modeli
admin.site.register(Admin)
admin.site.register(Conversations)
admin.site.register(Events)
admin.site.register(Categories)
admin.site.register(Organizators)
admin.site.register(Messages)
admin.site.register(Opinions)
admin.site.register(Reservations)
admin.site.register(UserCategories)
