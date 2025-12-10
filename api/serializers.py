from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from .models import Events, User, Categories, Reservations, Organizators, Opinions, Messages
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import check_password
from django.utils import timezone

class EventDetailSerializer(serializers.ModelSerializer):
    slots_number = serializers.IntegerField()
    organizator_user_id = serializers.SerializerMethodField(read_only=True)  # dodaj to pole
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Events
        fields = '__all__'
        extra_fields = ['organizator_user_id']

    def get_organizator_user_id(self, obj):
        return obj.organizator.user.id

    def get_category_name(self, obj):
        # Zakładamy, że obiekt kategorii ma pole 'name'
        return obj.category.name if obj.category else None

    def validate_name(self, value):
        if self.instance is not None:
            if Events.objects.exclude(pk=self.instance.pk).filter(name=value).exists():
                raise serializers.ValidationError("Event name is already in use.")
        else:
            if Events.objects.filter(name=value).exists():
                raise serializers.ValidationError("Event name is already in use.")
        return value


class EventSerializer(serializers.ModelSerializer):
    event_id = serializers.IntegerField(source='id', read_only=True)
    event_name = serializers.CharField(source='name')
    start_datetime = serializers.DateTimeField()  # Dodano pole start_date
    end_datetime = serializers.DateTimeField()  # Dodano pole end_date
    address = serializers.CharField()  # Dodano pole address

    class Meta:
        model = Events
        fields = ('event_id', 'event_name', 'start_datetime', 'end_datetime', 'address', 'description', 'category', 'slots_number')


class AddEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = '__all__'

    def create(self, validated_data):
        # Set totalSlots to the value of slots_number or default to 0 if not provided
        validated_data['totalSlots'] = validated_data.get('slots_number', 0)
        return super().create(validated_data)

    def validate(self, data):
        if data['start_datetime'] >= data['end_datetime']:
            raise serializers.ValidationError("End time must occur after start time")
        if data['start_datetime'] < timezone.now():
            raise serializers.ValidationError("Start time cannot be in the past")
        return data

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user_obj = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        Organizators.objects.create(user=user_obj)
        return user_obj

    def validate_email(self, value):
        if "@" not in value:
            raise serializers.ValidationError("Niepoprawny adres email.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Hasło musi mieć co najmniej 8 znaków.")
        return value




class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def check_user(self,clean_data):
        user = authenticate(username=clean_data['username'], password=clean_data['password'])
        if not user:
            raise ValidationError('user not found!')
        return user

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Hasło musi mieć co najmniej 8 znaków.")
        return value



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ['id', 'name']



class ReservationsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Include this nested serializer
    event = EventSerializer(read_only=True)

    class Meta:
        model = Reservations
        fields = ['id', 'slots_number', 'creation_date', 'event', 'user']




class ReservationsCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservations
        fields = ['id', 'event', 'slots_number', 'creation_date', 'user']
        extra_kwargs = {
            'user': {'read_only': True},
            'creation_date': {'read_only': True},
            'slots_number': {'read_only': True},  # Assuming you don't want this set by the user directly
        }

    def create(self, validated_data):
        # The user is set to the current user automatically
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class UserAccountSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password']
        read_only_fields = ['username']

    def update(self, instance, validated_data):
        # Handle the password separately
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)


class OpinionSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Opinions
        fields = ['id', 'text', 'author', 'user', 'created_at', 'updated_at']
        read_only_fields = ('author', 'user')

    def create(self, validated_data):
        # The author is the current user
        validated_data['author'] = self.context['request'].user
        # The user is taken from the URL and set here
        user_id = self.context.get('user_id')
        validated_data['user'] = User.objects.get(pk=user_id)
        return super(OpinionSerializer, self).create(validated_data)





class UserOpinionsSerializer(serializers.ModelSerializer):
    # This assumes that the 'author' is the user who created the opinion
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Opinions
        fields = ['id', 'text', 'author_username', 'created_at', 'updated_at']


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate_current_password(self, value):
        # Assuming self.context['request'].user is available and is the authenticated user
        user = self.context['request'].user
        if not check_password(value, user.password):
            raise serializers.ValidationError("Current password is not correct.")
        return value

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError({"confirm_new_password": "New passwords must match."})
        return attrs


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = ['id', 'text', 'timestamp', 'sender', 'receiver', 'updated_at']
