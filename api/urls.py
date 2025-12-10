from django.urls import path
from . import views
from django.views.generic import RedirectView

urlpatterns = [
    path('', RedirectView.as_view(url='/home', permanent=True)),
    path('api/events/', views.EventList.as_view(), name='event-list'),
    path('api/events/<int:pk>/', views.EventDetailView.as_view(), name='event-detail'),  # For retrieving event details
    path('api/events/delete/<int:pk>/', views.EventDeleteView.as_view(), name='event-delete'),
    path('api/login/', views.UserLogin.as_view(), name='login'),
    path('api/logout/', views.UserLogout.as_view(), name='logout'),
    path('api/userview/', views.UserView.as_view(), name='user'),
    path('api/myevents/', views.MyEventsList.as_view(), name='my-events'),
    path('api/addevent/', views.AddEventView.as_view(), name='add_event'),
    path('api/categories/', views.CategoriesView.as_view(), name='categories'),
    path('api/register/', views.UserRegister.as_view(), name='register'),
    path('api/myreservations/', views.MyReservationsList.as_view(), name='myreservations'),
    path('api/create_reservation/', views.ReservationCreate.as_view(), name='create_reservation'),
    path('api/edit/account/', views.UserDetailView.as_view(), name='account-detail'),
    path('api/current_user/', views.CurrentUserView.as_view(), name='current-user'),
    path('api/delete_reservation/<int:pk>/', views.ReservationDelete.as_view(), name='delete_reservation'),
    path('api/check_username/', views.CheckUsernameView.as_view(), name='check-username'),
    path('api/events/edit/<int:pk>/', views.EventUpdateView.as_view(), name='edit-event'),
    path('api/account/', views.UserDetailView.as_view(), name='account'),
    path('api/events/<int:pk>/reservations/', views.EventReservationsList.as_view(), name='event-reservations'),
    path('api/users/<int:pk>/', views.ProfileCheckView.as_view(), name='user-detail'),
    path('api/users/<int:id>/opinions/', views.UserOpinionsView.as_view(), name='user-opinions'),
    path('api/users/<int:id>/create_opinion/', views.CreateOpinionView.as_view(), name='create-opinion'),
    path('api/account/resetpassword/', views.ChangePasswordView.as_view(), name='reset_password'),
    path('api/send/', views.SendMessageView.as_view(), name='send_message'),
    path('api/messages/', views.GetMessagesView.as_view(), name='get_messages'),
    path('api/messages/<int:interlocutor_id>/', views.GetMessagesView.as_view(), name='get_messages'),
    path('api/chats/', views.UserListView.as_view(), name='user-list'),

]
