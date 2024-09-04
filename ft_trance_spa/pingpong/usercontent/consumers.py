# import json
# from asgiref.sync import async_to_sync
# from channels.generic.websocket import AsyncWebsocketConsumer

# class NotificationConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.group_name = 'public_room'
#         print("--------")
#         print(self)
#         print("^^^^^^^^")
#         await self.channel_layer.group_add(
#             self.group_name,
#             self.channel_name
#         )
#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(
#             self.group_name,
#             self.channel_name
#         )
#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         print("recive :", text_data)
#         message = text_data_json['message']
#         await self.send(text_data=json.dumps({
#             'message': message
#         }))
        
#     async def send_notification(self, event):
#         print(5* "--------")
#         print(event)
#         print(5* "^^^^^^^^")
#         await self.send(text_data=json.dumps({ 'message': event['message'] }))

# import json
# from asgiref.sync import async_to_sync
# from channels.generic.websocket import AsyncWebsocketConsumer
# from .models import Notification

# class NotificationConsumer(AsyncWebsocketConsumer):

#     async def connect(self):
#         await self.accept()
#         await self.send(text_data=json.dumps({
#             "type":"connection etablished",
#             "message":"you are now connected",
#         }))



    # async def send_existing_notifications(self):
    #     notifications = await self.get_user_notifications()
    #     for notification in notifications:
    #         await self.send(text_data=json.dumps({
    #             'message': notification.message
    #         }))
                   
    # def get_user_notifications(self):
    #     return Notification.objects.filter(user=self.user, is_read=False)
from asgiref.sync import sync_to_async 
from .models import Profile
    
async def get_profile(user):
    return await sync_to_async(Profile.objects.get)(user=user)
    
import json
from channels.generic.websocket import AsyncWebsocketConsumer





class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print(10*"*","Enter to connect function in consumer in status\n ")
        print(self.scope)
        # print("user \n\n\n   :",self.scope['user'])
        self.user = self.scope['user']
        
        if self.user.is_authenticated:
            # print("accept user :", self.user)
            profile = await get_profile(self.user)
            profile.is_online = True
            print(10*"*","is online \n ")
            await sync_to_async(profile.save)()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            profile = await get_profile(self.user)
            profile.is_online = False
            await sync_to_async(profile.save)()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        # print("message",message)
        # Handle received messages if needed fgf



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
        # print("event \n\n\n\n",event)
        message = event['message']
        avatar = event['avatar']
        is_read = event['is_read']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'avatar' : avatar,
            'is_read' : is_read
            
         }))