from django.urls import path, include
from .views import chat, send_msg, chats, all_unread_msgs_view


urlpatterns = [
    path('', chat),
    path('send_msg', send_msg),
    path('chats', chats),
    path('all_unread_msgs', all_unread_msgs_view),
]
