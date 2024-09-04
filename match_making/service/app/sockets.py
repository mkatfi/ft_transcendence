import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
import requests
import asyncio
import time
from asgiref.sync import sync_to_async
from .models import queue
import requests
import requests.cookies
from django.http import JsonResponse, HttpRequest,HttpResponseServerError,HttpResponseRedirect
from django.db import connection

def decode(headers):

    data = {}
    for key, value in headers:
        decoded_key = key.decode('utf-8')
        decoded_value = value.decode('utf-8')
        data[decoded_key] = decoded_value
    
    return data

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
    if response.status_code != 200:
        raise ValueError("authentification required")
    
    return True


def my_custom_sql_function():
    with connection.cursor() as cursor:
        cursor.execute("SELECT my_function()")
        result = cursor.fetchall()
        return result

async def delete_from_queue(id):
    ele = queue.objects.filter(socket_id=id)
    if await sync_to_async(ele.exists)():
        r = await sync_to_async(ele.delete)()

    

class sockets(AsyncWebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.group_name = "testNAME"
        self.login = None
        self.isPut = False

    async def connect(self):
        await self.accept()

        
    async def disconnect(self, close_code):
        await delete_from_queue(self.channel_name)
        try:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        except Exception as e:
            print("exited befor creating groupe --")

    async def chat_message(self, event):
        message = event["message"]
        await self.send(message)

    async def receive(self, text_data):
        if (self.isPut == False):
            self.isPut = True
            try :
                data = json.loads(text_data)
                is_auth(data)
                self.group_name = f'in_queue_{self.login}'
                self.login = data.get('login')
                await self.channel_layer.group_add(
                        self.group_name, 
                        self.channel_name
                    )
                await self.placeinQueue()

            except Exception as e:
                print(e)
                print("faile ----------------")
                # await self.send('authantication required')
                await self.close()

        pass

    async def placeinQueue(self):
        ele = queue.objects.filter(login=self.login)
        if await sync_to_async(ele.exists)():
            await sync_to_async(ele.delete)()
        var = queue()
        var.socket_id = self.channel_name
        var.login = self.login
        var.groupe = self.group_name
        r = await sync_to_async(var.save)()

        queryset = queue.objects.order_by("joined_at")[:2]
        data = await sync_to_async(list)(queryset)
        if len(data) == 2:
            
            await delete_from_queue(data[0].socket_id)
            await delete_from_queue(data[1].socket_id)
            res = await self.create_game(data[0].login, data[1].login)
            await self.redirect_signal(data[0].groupe, data[1].groupe)
            

    async def create_game(self, p1, p2):

        url = 'http://game:8000/api/create/'
        data = {
            'player1' : p1,
            'player2' : p2,
        }
        res = await sync_to_async(requests.post)(url=url,json=data)
        return res

    async def redirect_signal(self, p1, p2):

        ch = get_channel_layer()
        json_data = {
            'action' : 'redirect',
        }
        await ch.group_send(p1, {
                'type': 'chat_message', 
                "message": json.dumps(json_data)
            })

        await ch.group_send(p2, {
                'type': 'chat_message', 
                "message": json.dumps(json_data)
            })