
from asgiref.sync import sync_to_async 
from .models import Profile
    
async def get_profile(user):
    return await sync_to_async(Profile.objects.get)(user=user)
    
import json
from channels.generic.websocket import AsyncWebsocketConsumer





class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.user = self.scope['user']
        if self.user.is_authenticated:
            profile = await get_profile(self.user)
            profile.is_online = True
            await sync_to_async(profile.save)()
    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            profile = await get_profile(self.user)
            profile.is_online = False
            await sync_to_async(profile.save)()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']



class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.room_name = f'user_{self.user.username}'
        self.room_group_name = f'notification_{self.room_name}'
        # print("\n\n enter to connect \n\n")
        
        # print(" self.room_group_name \n--\n--\n---", self.room_group_name )
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # # Receive message from WebSocket
    # async def receive(self, text_data):
    #     text_data_json = json.loads(text_data)
    #     message = text_data_json['message']

    #     # Send message to room group
    #     await self.channel_layer.group_send(
    #         self.room_group_name,
    #         {
    #             'type': 'send_notification',
    #             'message': message
    #         }
    #     )

    # Receive message from room group
    async def send_notification(self, event):
        message = event['message']
        avatar = event['avatar']
        is_read = event['is_read']
        size = event['size_notf']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'avatar' : avatar,
            'is_read' : is_read,
            'size_notf':size
         }))