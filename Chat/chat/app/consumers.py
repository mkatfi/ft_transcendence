from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Chat, Message
import json

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()



    def receive(self, text_data):
        data = json.loads(text_data)
        type = data['type']
        user_id = data['user_id']
        if type == 'start':
            self.create_roomName(user_id)
        if type == 'msg_isRead':
            msg_id = data['msg_id']
            self.msg_isRead(msg_id)
        if type == 'all_unread_msgs':
            self.all_unread_msgs(user_id)
 
    def create_roomName(self, user_id):
        self.room_group_name = f'chat_{user_id}'
        print("last_player added to group: {}".format(
            self.room_group_name), flush=True)
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )

    def msg_isRead(self, msg_id):
        msg = Message.objects.get(id=msg_id)
        msg.is_read = True
        msg.save()
    
    def all_unread_msgs(self, user_id):
        all_unread_msgs = Message.objects.filter(receiver_id=user_id,
            is_read=False)
        self.send(text_data=json.dumps({
            'all_unread_msgs': all_unread_msgs,
            'type': 'unread_msgs',
        }))



    def new_msg(self, event):
        msg_text = event['msg_text']
        sender_id = event['sender_id']
        receiver_id = event['receiver_id']
        msg_id = event['msg_id']
        unread_msgs = event['unread_msgs']
        all_unread_msgs = event['all_unread_msgs']

        self.send(text_data=json.dumps({
            'type': 'send_msg',
            'sender_id': sender_id,
            'receiver_id': receiver_id,
            'msg_text': msg_text,
            'msg_id': msg_id,
            'unread_msgs': unread_msgs,
            'all_unread_msgs': all_unread_msgs,
        }))




    def disconnect(self, close_code):
        print("a user is rmoved from group", flush=True)
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )