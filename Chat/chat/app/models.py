from django.db import models
from django.utils import timezone
# Create your models here.




class Chat(models.Model):
    name = models.CharField(default='', max_length=50)
    user1_id = models.IntegerField(default=0)
    user2_id = models.IntegerField(default=0)
    chat_id = models.IntegerField(default=0)
    last_update =  models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.name


class Message(models.Model):
    sender_id = models.IntegerField(default=0)
    receiver_id = models.IntegerField(default=0)
    msg_text = models.CharField(max_length=1000)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE,
        related_name='messages')
    created_at = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)
