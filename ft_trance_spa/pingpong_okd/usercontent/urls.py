from django.urls import path
from . import views

urlpatterns = [
    # path('', views.firstPage, name='first'),
    # path('home', views.home, name='home'),
    path('api/register/', views.register, name='register'),
    # path('api/register/', views.Register.as_view(), name='register'),
    path('api/profile/<int:pk>/', views.Profileview.as_view(), name='profile_user'),
    path('api/profile/', views.ProfileList.as_view(), name='profile'),
    path('Home/', views.Home.as_view(), name='Home'),
    path('api/protected/', views.ProtectedData.as_view()),
    path('api/Notpprotected/', views.NotProtectedData.as_view()),
    path('api/userupdate/', views.UserDetail.as_view()),
    
    path('api/frequest/', views.FriendRequestList.as_view()),
    path('api/addfriend/<int:pk>/', views.CreateFriendRequest.as_view()),
    path('api/acceptfriend/<int:pk>/', views.ManageFriendRequest.as_view()),
    
    
    
    # path('profile', views.profile, name='profile'),
    # path('tournament', views.tournament, name='tournament'),
    # path('settings', views.settings, name='settings'),
    # path('leaderboard', views.leaderboard, name='leaderboard'),
    # path('friends', views.friends, name='friends'),
    # path('games', views.games, name='games'),
    # path('sendtofriend/<int:userID>/', views.send_friend_request, name='sendtofriend'),
    # path('acceptr/<int:RequestID>/', views.accept_friend_request, name='acceptr'),
    # path('deleter/<int:RequestID>/', views.delete_friend_request, name='deleter'),
    # path('friend_details/<int:userID>/', views.friend_details, name='friend_details'),
    # path('remove_friend/<int:userID>/', views.remove_friend, name='remove_friend'),
    # path('api/profile', views.getData),
    # path('api/profilepost', views.postData),
    # path('users/', views.UserList.as_view()),
    # path('users/<int:pk>/', views.UserDetail.as_view()),
]