import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
import requests
import asyncio
from asgiref.sync import sync_to_async
import time
from .match_making_api import *
from .online import *
from .is_auth import is_auth
from .models import InGame, Player

def decode(headers):

    data = {}
    for key, value in headers:
        decoded_key = key.decode('utf-8')
        decoded_value = value.decode('utf-8')
        data[decoded_key] = decoded_value
    return data

class sockets(AsyncWebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.group_name = None
        self.login = None
        self.player=None
        self.game =None
        
    async def connect(self):
        await self.accept()


    async def disconnect(self, close_code):
        print("can deconecti")
        if self.player:
            self.player.is_connected = False
            self.player.channel_id = None
            await sync_to_async(self.player.save)()
        
        try:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        except Exception as e:
            print(e)
            pass
        
        print("salit +-+-+-+")
    async def receive(self, text_data):
        try :
            data = json.loads(text_data)
            if self.game:
                data['player'] = self.channel_name
                obj = obj_list[self.game.pk].read_command(data)
            else:
                is_auth(data)
                self.login = data.get('login')
                await self.find_game()
        except Exception as e:
            print(e)
            print("aaaaaaaaaaaaa-----------aaaaaaaaaaa")
            await self.close()

    async def redirect(self, pageURl):
        pass

    async def check_if_both_are_connected(self):
        if self.game:
            p1 = await sync_to_async(Player.objects.get)(login = self.game.player1)
            p2 = await sync_to_async(Player.objects.get)(login = self.game.player2)
            print("players are found")
            if p1.is_connected and p2.is_connected:
                print("players are connected")
                self.game.game_started = True
                await sync_to_async(self.game.save)()
                await runtask(self.game.pk)
        

    async def find_game(self):
        # get game / this player from db
        self.player = await sync_to_async(Player.objects.get)(login=self.login, is_connected = False)
        if self.player.side == 1:
            self.game = await sync_to_async(InGame.objects.get)(player1= self.player.login)
        else:
            self.game = await sync_to_async(InGame.objects.get)(player2= self.player.login)
        # add connect this channel with game obj
        self.group_name = await connect(self.game.pk,self.channel_name,  self.player.side)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        # udate database
        self.player.is_connected = True
        self.player.channel_id = self.channel_name
        await sync_to_async(self.player.save)()
        # start game if both players are connected (if game is hasnt started yet)
        if not self.game.game_started :
            await self.check_if_both_are_connected()

    async def echo_group(self, task):
        msg = json.dumps(task)
        await self.channel_layer.group_send(self.group_name, {"type": "chat_message","message": msg})

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        await self.send(message)

    async def disconnect_event(self, event):
        try:
            print("**99**99**99**78")
            await self.close()
            print("clzitha")
        except Exception as e:
            print(e)

    async def private_message(self, event):
        message = event["message"]
        if self.channel_name == event["id"]:
            await self.send(message)

    async def save_group_name(self, event):
        message = event["message"]
        self.group_name = message

    async def create_group(self, task):
        channel1 = task["player1"]
        channel2 = task["player2"]
        self.group_name = "group1gameonly"
        await self.channel_layer.group_add(self.group_name, channel1)
        await self.channel_layer.group_add(self.group_name, channel2)
        
    async def change_dom(self):
        cmd = get_cmd('hide_queue', {'event': 'hide_queue'})
        await self.echo_group(cmd)
