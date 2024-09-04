from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile,Friend_Request



from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        
        # ...
        profile = Profile.objects.get(user=user)
        avatar_url = profile.avatar.url if profile.avatar else None
        print(avatar_url)
        token['profile']= {
            'bio': profile.bio,
            'avatar': avatar_url,
            'friends': [friend.username for friend in profile.friends.all()]
        }
        return token


class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    class Meta:
        model = User
        fields = ['id','username', 'first_name', 'last_name', 'email', 'password1', 'password2']
        
        
    def validate(self, data):
        """
        Check that the two password entries match.
        """
        if len(data['password1']) < 8:
            raise serializers.ValidationError({
                'password1': "Password must be at least 8 characters long."
            })
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({
                'password2': "Passwords do not match."
            })
        return data


    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')  
        user = User(**validated_data)
        user.set_password(password)  
        user.save()
        return user
    

class UpdateUserSerializser(serializers.ModelSerializer):
    
    
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']
        

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    friends = UserSerializer(many=True, read_only=True)  # To serialize friends as user details

    class Meta:
        model = Profile
        fields = ['user', 'avatar', 'bio', 'friends', 'access_token', 'remote_user', 'is_active','is_online']
        

class UserSerializerDetails(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']  

class FriendRequestSerializer(serializers.ModelSerializer):
    sender = UserSerializerDetails(read_only=True)
    receiver = UserSerializerDetails(read_only=True)

    
    
    class Meta:
        model = Friend_Request
        fields = ["id","receiver","sender"]


# class CreateFriendRequestSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Friend_Request
#         fields = ["id","receiver","sender"]
#     def create(self, validated_data):
#         return Friend_Request.objects.create(**validated_data)