from django.db import transaction
from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions, status
from rest_framework.generics import UpdateAPIView, ListAPIView

from .models import Events, Categories, Organizators, Reservations, Opinions, Messages
from rest_framework.response import Response
from .serializers import (EventDetailSerializer, EventSerializer, UserRegisterSerializer, UserLoginSerializer,
                          UserSerializer, CategoriesSerializer, ReservationsSerializer, ReservationsCreateSerializer,
                          OpinionSerializer, UserOpinionsSerializer, ChangePasswordSerializer, MessageSerializer,
                          AddEventSerializer)
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import login, logout, authenticate, update_session_auth_hash
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework import mixins
from django.utils import timezone
import pusher
from django.shortcuts import get_object_or_404

pusher_client = pusher.Pusher(
  app_id='1710215',
  key='134af4bb28d2464c405e',
  secret='bc512e7a0766a7900f61',
  cluster='eu',
  ssl=True
)

class EventDetailView(generics.RetrieveAPIView):
    queryset = Events.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


class EventList(generics.ListAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer
    permission_classes = (permissions.AllowAny,)


class EventDeleteView(generics.DestroyAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def delete(self, request, *args, **kwargs):
        event = self.get_object()
        # Make sure the user trying to delete the event is the organizer
        if not request.user.organizator_profile == event.organizator:
            return Response({"detail": "You do not have permission to delete this event."}, status=status.HTTP_403_FORBIDDEN)
        return super(EventDeleteView, self).delete(request, *args, **kwargs)




class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data.copy()
        serializer = UserRegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        serializer = UserLoginSerializer(data=data)

        if serializer.is_valid(raise_exception=True):
            user = authenticate(username=data['username'], password=data['password'])
            if user:
                login(request, user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                print(request.data)
                return Response({"detail": "Niepoprawne dane logowania."}, status=status.HTTP_401_UNAUTHORIZED)


class UserLogout(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class MyEventsList(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Events.objects.filter(organizator__user=user)


class AddEventView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Pobierz zalogowanego organizatora
        organizator = Organizators.objects.get(user=request.user)

        # Skopiuj dane i dodaj organizatora do danych
        data = request.data.copy()
        data['organizator'] = organizator.id
        data['totalSlots'] = data.get('slots_number')  # Ustaw totalSlots na wartość slots_number

        # Utwórz serializator z danymi
        serializer = AddEventSerializer(data=data)

        # Sprawdź czy dane są prawidłowe i zapisz wydarzenie
        if serializer.is_valid():
            event = serializer.save()
            return Response(EventDetailSerializer(event).data, status=status.HTTP_201_CREATED)
        else:
            # Jeśli dane są nieprawidłowe, zwróć błędy
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoriesView(generics.ListAPIView):
    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer
    permission_classes = [permissions.IsAuthenticated]


class MyReservationsList(generics.ListAPIView):
    serializer_class = ReservationsSerializer  # Serializer, który będziemy musieli utworzyć
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Reservations.objects.filter(user=user)


class ReservationCreate(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        event_id = request.data.get('event')
        event = get_object_or_404(Events, id=event_id)

        with transaction.atomic():
            if event.slots_number <= 0:
                return Response({'error': 'No slots available.'}, status=status.HTTP_400_BAD_REQUEST)

            event.slots_number -= 1
            event.save()

            reservation_data = {
                'event': event.id,
                'user': user.id,
                'slots_number': 1,  # Assuming each reservation is for one slot
            }
            serializer = ReservationsCreateSerializer(data=reservation_data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                # Roll back event slots_number update if reservation save fails
                event.slots_number += 1
                event.save()
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReservationDelete(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk, *args, **kwargs):
        reservation = get_object_or_404(Reservations, pk=pk, user=request.user)

        with transaction.atomic():
            event = reservation.event
            event.slots_number += 1
            event.save()

            reservation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)




class UserDetailView(generics.GenericAPIView, mixins.UpdateModelMixin, mixins.RetrieveModelMixin):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # This method ensures that we are returning the user instance associated with the request
        return self.request.user

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


#pobranie id zalogowanego uzytkownika
class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)



class CheckUsernameView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username', None)
        if username is None:
            return Response({"detail": "Parametr 'username' jest wymagany."}, status=status.HTTP_400_BAD_REQUEST)

        is_taken = User.objects.filter(username=username).exists()
        return Response({"is_taken": is_taken})


class EventUpdateView(UpdateAPIView):  # Use UpdateAPIView for handling PUT requests
    queryset = Events.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # This ensures that only organizers can edit their events
        user = self.request.user
        return Events.objects.filter(organizator__user=user)

    def update(self, request, *args, **kwargs):
        event = self.get_object()
        if event.organizator.user != request.user:
            return Response({"detail": "Not authorized to edit this event."}, status=status.HTTP_403_FORBIDDEN)
        return super(EventUpdateView, self).update(request, *args, **kwargs)



class EventReservationsList(generics.ListAPIView):
    serializer_class = ReservationsSerializer

    def get_queryset(self):
        event_id = self.kwargs['pk']
        return Reservations.objects.filter(event__id=event_id)


class ProfileCheckView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CreateOpinionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        serializer = OpinionSerializer(data=request.data, context={'request': request, 'user_id': id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class UserOpinionsView(ListAPIView):
    serializer_class = UserOpinionsSerializer

    def get_queryset(self):
        # The 'id' parameter should match the name in your URL pattern
        user_id = self.kwargs['id']
        return Opinions.objects.filter(user__id=user_id)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            update_session_auth_hash(request, user)  # Aktualizacja sesji po zmianie hasła
            return Response({"status": "password changed"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['sender'] = request.user.id  # lub `request.user.pk`

        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            message = serializer.save()
            # Wysyłanie powiadomienia do Pusher
            pusher_client.trigger('chat', 'message', {'text': message.text})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetMessagesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, interlocutor_id, *args, **kwargs):  # 'interlocutor_id' jest oczekiwany jako argument
        user_id = request.user.id
        messages = Messages.objects.filter(
            (Q(sender_id=user_id) & Q(receiver_id=interlocutor_id)) |
            (Q(sender_id=interlocutor_id) & Q(receiver_id=user_id))
        ).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]