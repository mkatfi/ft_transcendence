from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver

from remote_auth.views import get_user
from .models import Profile,Friend_Request
from django.contrib.auth.signals import user_logged_out

# @receiver(post_save, sender=User)
# def create_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)


# @receiver(post_save, sender=User)
# def save_profile(sender, instance, **kwargs):
#     instance.profile.save()

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        print(5*"#")
        print(instance)
        print(5*"#")
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()




from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification,Friend_Request
from .serializer import NotificationSerializer



@receiver(post_save, sender=Notification)
def notification_created(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        room_name = f'user_{instance.user.username}'
        user_group_name = f"notification_{room_name}"
        print("Create new notificationn \n\n",user_group_name)
        profile = Profile.objects.get(user=instance.user)
        avatar_url = profile.avatar.url if profile.avatar else None
        async_to_sync(channel_layer.group_send)(
            user_group_name,
                  {
                "type": "send_notification",
                "message": instance.message,
                "avatar"  : avatar_url,
                "is_read" : instance.is_read
            }
        )
@receiver(post_save, sender=Friend_Request)
def create_friend_request_notification(sender, instance, created, **kwargs):
    if created:
        message = f" You have a new friend request from {instance.sender.username}"
        Notification.objects.create(user=instance.receiver, message=message)