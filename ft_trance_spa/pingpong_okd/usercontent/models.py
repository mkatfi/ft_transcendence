from django.db import models
from django.contrib import messages

# Create your models here.

# class Login(models.Model):
#     username = models.CharField( max_length=50)
#     password = models.CharField(max_length=50)
#     date_of_birth = models.DateField(null=True, blank=True)
#     date_of_death = models.DateField('Died', null=True, blank=True)
    
# python3 manage.py makemigrations
# python3 manage.py migrate
# class Profile(models.Model):
#     username = models.CharField( max_length=50,default="username")
#     imgprofile = models.ImageField(null=True,upload_to ='photos/%Y/%m/%d/',default="default.png")
from django.utils import timezone 
# from django.db import models
from django.contrib.auth.models import User,AbstractUser
# from PIL import Image

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, default=None)
    avatar = models.ImageField(default='default.jpg', upload_to='profile_images')
    bio = models.TextField(max_length=60, null=True)
    friends = models.ManyToManyField(User, blank=True, related_name='user_friends',symmetrical=False)
    access_token = models.CharField(max_length=200, null=True, blank=True)
    remote_user = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)  # New field for online status


    # def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)
    #     img = Image.open(self.avatar.path)
    #     max_size = (300, 300)  # Set the maximum width and height

    #     img.thumbnail(max_size)
    #     img.save(self.avatar.path)

    def __str__(self):
        if self.user:
            return self.user.username
        else:
            return 'No associated user'
    
class Friend_Request(models.Model):
    sender = models.ForeignKey(User, related_name='sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='reciver', on_delete=models.CASCADE)
    # sendername = models.CharField(max_length=100,default="")
    # receivername = models.CharField(max_length=100,default="")

    
    # def save(self, *args, **kwargs):
    #     if not self.sendername:
    #         self.sendername = self.sender.username
    #     if not self.receivername:
    #         self.receivername = self.receiver.username
    #     super(Friend_Request, self).save(*args, **kwargs)
            
    # is_active = models.BooleanField(blank=True ,default=True)  
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
    
# import os
# from django.dispatch import receiver
#     # delete image when Profile deleted
# @receiver(models.signals.post_delete, sender=Profile)
# def auto_delete_file_on_delete(sender, instance, **kwargs):
#     if instance.image and not instance.image.path == default_image_path:
#         if os.path.isfile(instance.image.path):
#             os.remove(instance.image.path)

# # delete old image when a new image is selected
# @receiver(models.signals.pre_save, sender=Profile)
# def auto_delete_file_on_change(sender, instance, **kwargs):
#     if not instance.pk:
#         return False

#     try:
#         old_file = Profile.objects.get(pk=instance.pk).image
#     except Profile.DoesNotExist:
#         return False

#     new_file = instance.image
#     if not old_file == new_file and old_file.path != default_image_path:
#         if os.path.isfile(old_file.path):
#             os.remove(old_file.path)
