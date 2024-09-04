from django.db import models
from django.contrib import messages


from django.utils import timezone 
from django.contrib.auth.models import User,AbstractUser

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, default=None)
    avatar = models.ImageField(default='default.jpg', upload_to='profile_images')
    bio = models.TextField(max_length=60, null=True)
    friends = models.ManyToManyField(User, blank=True, related_name='user_friends',symmetrical=False)
    access_token = models.CharField(max_length=200, null=True, blank=True)
    remote_user = models.BooleanField(default=False)
    ruser_id = models.IntegerField(default=-1)
    is_active = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)  # New field for online status
    def __str__(self):
        if self.user:
            return self.user.username
        else:
            return 'No associated user'
    
class Friend_Request(models.Model):
    sender = models.ForeignKey(User, related_name='sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='reciver', on_delete=models.CASCADE)
    def accept_friend(self,request):
        if self.receiver == request.user:
            self.receiver.profile.friends.add(self.sender)
            self.sender.profile.friends.add(self.receiver)
            messages.success(request, 'Friend request accepted successfully.')
            return True
        else:
            messages.error(request, 'You are not authorized to accept this friend request.')
        return False
        
    def __str__(self):
        return f"{self.sender.username} -&gt; {self.receiver.username}"




class Notification(models.Model):
    message = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE,default=1)
    timestamp = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)
    def __str__(self):
        return self.message
