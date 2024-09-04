from django.urls import path
from . import views

urlpatterns = [
    path("get_view/" ,views.get_game_view),
    path("create/", views.creat_game),
    path("is_ingame/", views.is_in_game.as_view()),
]