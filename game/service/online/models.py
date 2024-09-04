from django.db import models
from datetime import datetime
from django.utils import timezone

class Player(models.Model):
    login = models.CharField("login", max_length=50,unique=True)
    is_connected = models.BooleanField("is_connected",default=False)
    score = models.IntegerField("score",default= 0)
    channel_id = models.CharField("socket",null=True, max_length=255)
    side = models.IntegerField("side",default= 0)
    imageURL = models.CharField("imageURL", max_length=500, default="None")


class InGame(models.Model):
    player1 = models.CharField("player1", max_length=50,unique=True)
    player2 = models.CharField("player2", max_length=50,unique=True)
    created_at = models.DateTimeField("create_date", default=timezone.now)
    round = models.IntegerField("round",default= 1)
    game_started = models.BooleanField("game_started",default= False)
    type = models.CharField("type", max_length=20, default="normal")
    gid = models.IntegerField("gid", default=-1)

class PonGames(models.Model):
    gamename = models.CharField("gamename", max_length=50,default="")
    player1 = models.CharField("player1", max_length=50)
    player2 = models.CharField("player2", max_length=50)
    created_at = models.DateTimeField("create_date", default=timezone.now)
    goals_order =  models.CharField("goals_order", max_length=10, default="")
    p1goal = models.IntegerField("p1goal",default= 0)
    p2goal = models.IntegerField("p2goal",default= 0)
    winner = models.CharField("winner", max_length=50,default="")

class PlayerStats(models.Model):
    login = models.CharField("login", max_length=50,unique=True)
    games_played = models.IntegerField("games_played",default= 0)
    wins  = models.IntegerField("wins",default= 0)
    loss  = models.IntegerField("loss",default= 0)
    goals_scored  = models.IntegerField("goals_scored",default= 0)
    goals_conceded  = models.IntegerField("goals_conceded",default= 0)
    