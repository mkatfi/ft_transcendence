from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.contrib import messages
from urllib.parse import urlencode
from .decorators import unauthentication_user, autenticated_only
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.http import HttpResponse
from django.http import JsonResponse
import os
import secrets
import requests
from django.core.files import File
from urllib.request import urlopen
from tempfile import NamedTemporaryFile
from django.core.exceptions import ValidationError
from usercontent.models import Profile
# from rest_framework import response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from usercontent.serializer import UserSerializer

import random
import string

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh_token': str(refresh),
        'access_token': str(refresh.access_token),
    }


# environment varibels
state = secrets.token_urlsafe(15)
client_id = os.environ.get('client_id')
redirect_uri = os.environ.get('redirect_uri')
client_secret = os.environ.get('client_secret')

# Remote authentication
# @unauthentication_user
def intra_authorize(request):
    
    print("enter here remote \n")
    url = 'https://api.intra.42.fr/oauth/authorize'
    query_params = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'public',
        'state': state,
    }
    authorization_url = f"{url}?{urlencode(query_params)}"
    return redirect(authorization_url)

def exchange_data(code):
    token_url = "https://api.intra.42.fr/oauth/token"
    payload = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code,
        'redirect_uri': redirect_uri,
    }
    response = requests.post(token_url, data=payload)
    post_data = response.json()
    return post_data

# download image of remote user from intra
def download_image_from_url(user_prf, image_link):
    try:
        img_temp = NamedTemporaryFile(delete=True)
        with urlopen(image_link) as img_link:
            img_temp.write(img_link.read())
            img_temp.flush()
        user_prf.avatar.save(f"image_{user_prf.pk}.jpg", File(img_temp))
    except Exception as e:
        return ValidationError(f"Failed to download image from {image_link}: {e}")



def getRandemUsername(username):
    s = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
    return(f'{username}{s}')

def UsercreateORupdate(access_token, user_data):
    login = user_data.get('login')
    email = user_data.get('email')
    id = user_data.get('id')
    image_link = user_data.get('image')['link']

    userP = User.objects.filter(username=login)
    userP = userP[0]
    if(userP):
        checkUsername = Profile.objects.filter(user=userP,remote_user=True)
        useralready = Profile.objects.filter(ruser_id=id)
        if useralready:
            login = useralready[0].user.username
        elif not checkUsername:
            check = True  
            while  check: 
                login = getRandemUsername(login) 
                check = User.objects.filter(username=login)
     
     
                    
    user, created = User.objects.get_or_create(username=login)
    if created: # create user from scrash
        user_prf = Profile.objects.get(user=user)
        user_prf.access_token = access_token
        user_prf.remote_user = True
        user_prf.ruser_id = id
        download_image_from_url(user_prf, image_link)
        user_prf.save()
        
    else: # update user
        user_prf = Profile.objects.get(user=user)
        user_prf.access_token = access_token
        user_prf.save()
    return(get_tokens_for_user(user))    



# @unauthentication_user
@api_view(['GET'])
@permission_classes([AllowAny])
def authorization_intra(request):
    code = request.GET.get('code')
    new_state = request.GET.get('state')
    if new_state == state:
        post_data = exchange_data(code)
        access_token = post_data.get('access_token')
        if access_token:
            user_data = fetch_data(access_token)
            token = UsercreateORupdate(access_token, user_data)

            return JsonResponse(token)
    return JsonResponse({'error': 'Invalid state or code'}, status=400)

# @api_view(['GET'])
# def afterauthorization(request):

#     return Response({
#         "user": userser.data,
#         "access_token": access_token,
#         "refresh_token": refresh_token
#     })

    


def fetch_data(access_token):
    url = 'https://api.intra.42.fr/v2/me'
    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except:
        return None
    return response.json()

# def R_login(request):
#     return render(request, 'registration/login.html')

# @autenticated_only
# def home(request):
#     user_prf = get_user(request)
#     if user_prf:
#         request.user = user_prf.user
#     context = {'user_prf':user_prf}
#     return render(request, 'registration/home.html', context)

# @autenticated_only
# def _logout(request):
#     logout(request)
#     request.session.set_expiry(0)
#     return redirect('R_login')


def get_user(request):
    # local user
    if request.user.is_authenticated:
        try:
            user_prf = Profile.objects.get(user=request.user)
            return user_prf
        except:
            return None

    # remote user 
    try:
        access_token = request.session['access_token']
    except:
        return None
    user_prf = None
    if access_token:
        try:
            user_prf = Profile.objects.get(access_token=access_token)
        except:
            return None
    return user_prf


