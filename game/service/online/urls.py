from django.urls import path
from . import views

urlpatterns = [

    path("players/", views.players_list),
    path("players/clear/", views.players_clear),

    path("players/", views.players_list),
    path("players/clear/", views.players_clear),

    path("in_games/", views.in_games_list),
    path("in_games/clear/", views.in_games_clear),
    
    path("stats/", views.stats),
    path("stats/clear/", views.stats_clear),

    path("logs/", views.logs),
    path("logs/clear/", views.logs_clear),
    

    # path("login/", LoginView.as_view(), name="login")
    # path('protected/', my_protected_view, name='protected'),
    # path('ping_pong/local/', ping_pong_local, name='Ping Pong'),
]