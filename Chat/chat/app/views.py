from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from .models import Chat, Message
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models import Q
import json
from django.http import HttpResponse
from django.utils import timezone
# Create your views here.

def chat_messages(chat: Chat, user_id):
    messages = chat.messages.all()

    msgs = []
    for msg in messages:
        if msg.receiver_id == user_id:
            msg.is_read = True
            msg.save()
        msgs.append({
            'sender': msg.sender_id,
            'receiver': msg.receiver_id,
            'message': msg.msg_text,
        })
    return msgs

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def chat(request):
    if request.method == "POST":
        data = request.data
        current_uid = int(data['current_uid'])
        other_uid = int(data['other_uid'])
        try:
            chat = Chat.objects.get(chat_id=current_uid+other_uid)
        except:
            return HttpResponse(json.dumps({'created': False ,'msgs': []}),
                content_type='application/json')  
        msgs = chat_messages(chat, current_uid)
        return HttpResponse(json.dumps({'created': True ,'msgs': msgs}),
            content_type='application/json')
    return HttpResponse(json.dumps({'Message': 'this allow only POST'}),
            content_type='application/json')


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def send_msg(request):
    if request.method == "POST":
        data = request.data
        sender_id = int(data['sender_id'])
        receiver_id = int(data['receiver_id'])
        msg_text = data['message']
        try:
            chat = Chat.objects.get(chat_id=sender_id+receiver_id)
            chat.last_update = timezone.now()
            chat.save()
        except:
            chat = Chat.objects.create(chat_id=sender_id+receiver_id)
            chat.user1_id = sender_id
            chat.user2_id = receiver_id
            chat.save()
        message = Message.objects.create(chat=chat)
        message.msg_text = msg_text
        message.sender_id = sender_id
        message.receiver_id = receiver_id
        message.save()
        # send to other user in his group name
        send_to_receiver(message, chat, receiver_id)
        return HttpResponse(json.dumps({'status': 'ok'}),
            content_type='application/json')
    return HttpResponse(json.dumps({'Message': 'this allow only POST'}),
            content_type='application/json')

def send_to_receiver(message: Message, chat, user_id):
    channel_layer = get_channel_layer()
    room_group_name = f'chat_{message.receiver_id}'
    unread_messages = unread_msgs(chat, user_id)
    all_unread_messages = all_unread_msgs(user_id)

    async_to_sync(channel_layer.group_send)(
        room_group_name,
        {
            'type': 'new_msg',
            'msg_id': message.pk,
            'sender_id': message.sender_id,
            'receiver_id': message.receiver_id,
            'msg_text': message.msg_text,
            'unread_msgs': unread_messages,
            'all_unread_msgs': all_unread_messages,
        },
    )
    
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def chats(request):
    if request.method == 'POST':
        data = request.data
        user_id = int(data['user_id'])
        chat_list = Chat.objects.filter(Q(user1_id=user_id) | Q(user2_id=user_id))
        ordred_chat_list = chat_list.order_by('-last_update')
        response = chat_list_response(ordred_chat_list, user_id)
        return HttpResponse(json.dumps({'chats': response}),
            content_type='application/json')
    return HttpResponse(json.dumps({'Message': 'this allow only POST'}),
            content_type='application/json')

def chat_list_response(chats, user_id):
    chat_list = []
    for chat in chats:
        unread_msg = chat.messages.filter(receiver_id=user_id,is_read=False)
        chat_list.append({
            'id': chat.id,
            'user1_id': chat.user1_id,
            'user2_id': chat.user2_id,
            'chat_id': chat.chat_id,
            'unread_msg': unread_msg.count(),
        })
    return chat_list


def unread_msgs(chat: Chat, user_id):
    Unread_msgs = Message.objects.filter(chat=chat,
        receiver_id=user_id, is_read=False)
    return Unread_msgs.count()

def all_unread_msgs(user_id):
    unread_msgs = Message.objects.filter(receiver_id=user_id,
        is_read=False)
    print("_______unres",unread_msgs)
    return unread_msgs.count()

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def all_unread_msgs_view(request):
    if request.method == 'POST':
        user_id = request.data['user_id']
        all_unread_mssgs = all_unread_msgs(user_id)
        print(all_unread_mssgs)
        return HttpResponse(json.dumps({'all_unread_mssgs': all_unread_mssgs}), 
            content_type='application/json')
    return HttpResponse(json.dumps({'all_unread_mssgs': 0}), 
            content_type='application/json')