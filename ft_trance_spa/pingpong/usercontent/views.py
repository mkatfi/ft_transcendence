from django.contrib.auth.models import User
from .models import Profile,Friend_Request ,Notification
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializer import ProfileSerializer

from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import UserSerializer ,UpdateUserSerializser,FriendRequestSerializer,NotificationSerializer

from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes 
# from .serializer import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
import json


# class MyTokenObtainPairView(TokenObtainPairView):
#     serializer_class = MyTokenObtainPairSerializer

# from rest_framework_simplejwt.tokens import RefreshToken

# def get_tokens_for_user(user):
#     refresh = RefreshToken.for_user(user)
#     return {
#         'refresh': str(refresh),
#         'access': str(refresh.access_token),
#     }
    
    
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # token = get_tokens_for_user(user)"token": token, 
            return Response({"user": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   





from rest_framework_simplejwt.authentication import JWTAuthentication


class Home(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)

def get_profile(user):
    profile = Profile.objects.get(user=user)
    return profile

            
    
    
class ProfileList(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    """
    List all snippets, or create a new snippet.
    """
    def get(self, request, format=None):
        profile = Profile.objects.all()
        serializer = ProfileSerializer(profile, many=True)
        return Response(serializer.data)

class UserDetail(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UpdateUserSerializser(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def is_auth(request):
    print(request.headers)
    json_data = {
        "is_auth" : True,
        "redirect": ""
    }
    
    if request.user.is_authenticated:
        json_data = {
            "is_auth" : True,
            "redirect": "",
            "userid" : request.user.username
    }
    else:
        json_data["is_auth"]= False
        json_data['redirect'] = '/accounts/login'
        try:
            access_token = request.session['access_token']
            if access_token:
                user = Profile.objects.get(access_token=access_token)
                json_data['userid'] = user.user.username
                json_data['is_auth'] = True
        except Exception as e:
            pass    

    responce = HttpResponse(json.dumps(json_data))
    return responce

@csrf_exempt
def getUser(request):
    if request.method == 'POST':
        try:
            body_unicode = request.body.decode('utf-8')
            body_data = json.loads(body_unicode)
            
            # Process the JSON data
            login = body_data.get('login', '')
            user = User.objects.get(username = login)
            prf = Profile.objects.get(user=user)
            res = {
                "login" : login,
                "image" : prf.avatar.url,
            }

            return HttpResponse(json.dumps(res))
        except json.JSONDecodeError as e:
            return HttpResponse(f'Error decoding JSON: {str(e)}', status=400)
    else:
        return HttpResponse('Unsupported request method')

class Profileview(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404
    def get(self, request,pk, format=None):
            user = self.get_object(pk)
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        print("enter here \n\n")
        user = self.get_object(pk)
        profile = Profile.objects.get(user=user)
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            print(user)
            print('profile',profile)
            print(serializer.data)
            # token = get_tokens_for_user(user)
            return Response({"success": "Avatar updated successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # def delete(self, request, pk, format=None):
    #     profile = self.get_object(pk)
    #     snippet.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
        
        

class ProtectedData(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Hello, This is valid!'}
        return Response(content)
    
def user_friends(request):
    profile = get_profile(request.user)
    user_friends = profile.friends.all()
    return user_friends

class FriendRequestList(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        current_user = request.user
        all_friend_requests = Friend_Request.objects.filter(receiver=current_user)
        all_friend_requests_send = Friend_Request.objects.filter(sender=current_user)
        serializer = FriendRequestSerializer(all_friend_requests, many=True)
        serializer_send = FriendRequestSerializer(all_friend_requests_send, many=True)
        return Response({"ireceive":serializer.data,"isend" : serializer_send.data}, status=status.HTTP_200_OK)
    
class CreateFriendRequest(APIView):
    
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, format=None):
        sender = request.user
        try:
            receiver = User.objects.get(id=pk)
            friend_request, created = Friend_Request.objects.get_or_create(
                sender=sender, receiver=receiver
            )
            if created:
                return Response({'success': f'Friend request sent successfully to {receiver}.'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'info': f'Friend request already sent to {receiver}.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User otn found.'}, status=status.HTTP_404_NOT_FOUND)


class ManageFriendRequest(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self,request,pk,format=None):
        try:
            friend_request = Friend_Request.objects.get(id=pk)
        except Friend_Request.DoesNotExist:
            return Response({'error': 'Friend request not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        if (friend_request.accept_friend(request)):
            print("deleted",friend_request)
            friend_request.delete()
            return Response({'success': 'new friend added  successfully.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'You are not authorized to accept this friend request.'}, status=status.HTTP_403_FORBIDDEN)
    
    def delete(self,request,pk,format=None):
        try:
            friend_request = Friend_Request.objects.get(id=pk)
        except Friend_Request.DoesNotExist:
            return Response({'error': 'Friend request not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        if friend_request.receiver == request.user or friend_request.sender == request.user:
            friend_request.delete()
            return Response({'success': 'Friend request deleted successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'You are not authorized to delete this friend request.'}, status=status.HTTP_403_FORBIDDEN)
    
    

           
class NotifictionDetails(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self,request,pk,format=None):
        try:
            notification = Notification.objects.get(id=pk)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)
    def delete(self,request,pk,format=None):
        try:
            notification = Notification.objects.get(id=pk)
            notification.delete()
            return Response({'message': 'Notifiation deleted successfully.'}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    
class NotifictionList(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self,requset,format=None):
        notifications =  Notification.objects.filter(user=requset.user)
        notification_count = notifications.count()
        notserializer = NotificationSerializer(notifications, many=True)
        return Response({"notf":notserializer.data,"number":notification_count
                         }  , status=status.HTTP_200_OK)
        
        
class FriendDetails(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, format=None):
        try:
            userfriend = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'error': 'User friend not found.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            profile = Profile.objects.get(user=request.user)
            prfriend = Profile.objects.get(user=userfriend)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        print(userfriend,flush=True)    
        print(request.user,flush=True)           
        if userfriend in profile.friends.all():
            profile.friends.remove(userfriend)
            prfriend.friends.remove(request.user)
            
            return Response({"success": "Friend removed successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User is not in your friends list.'}, status=status.HTTP_400_BAD_REQUEST)


class ChangePassword(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def put(self, request, pk, format=None):
        oldpassword = request.data['oldpassword']
        newpassword = request.data["newpassword"]
        user = User.objects.get(id=pk)
        
        if not user.check_password(raw_password=oldpassword):
            return Response({'error': 'password not match'}, status=400)
        else:
            user.set_password(newpassword)
            user.save()
            return Response({'success': 'password changed successfully'}, status=200)
        
        







            

        