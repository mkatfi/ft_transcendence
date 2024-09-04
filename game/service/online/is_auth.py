
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import requests.cookies
from django.http import JsonResponse, HttpRequest,HttpResponseServerError,HttpResponseRedirect
import json

def is_auth(headers):
    auth_url = "http://django:8000/api/protected/"
    default_headers = requests.utils.default_headers()

    headers_costum = {
            'Content-Type': 'application/json',
            'Authorization': f"Bearer {headers.get('access_token')}",
        }
    headers_dict = default_headers.copy()
    headers_dict.update(headers_costum)
    
    response = requests.get(auth_url, headers=headers_dict)
    print(response)
    if response.status_code != 200:
        raise ValueError("authentification required")
    print('done')

def is_auth2(token):
    auth_url = "http://django:8000/api/protected/"
    default_headers = requests.utils.default_headers()

    headers_costum = {
            'Authorization': f"Bearer {token}",
        }
    headers_dict = default_headers.copy()
    headers_dict.update(headers_costum)
    print(headers_dict)
    response = requests.get(auth_url, headers=headers_dict)
    print(response)
    if response.status_code != 200:
        raise ValueError("authentification required")
    print('done')
