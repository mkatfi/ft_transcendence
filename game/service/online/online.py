import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
import requests
import asyncio
import time
from .match_making_api import get_cmd
from .consts import gameContants as consts
import math
from .player import Player_movment
from .ball import Ball_movment
from .models import *
from asgiref.sync import sync_to_async

task_list = {}
obj_list = {}


async def runtask(id):
    print("running task ---------------  77")
    task_list[id] = asyncio.create_task(obj_list[id].loop())
    print("running task ---------------  emd *---")

def add_to_task_list(id, game_table, p1_table, p2_table):
    print(f"created : \n\t game {game_table.pk} \n\t playe1 {p1_table.pk} \n\t playe2 {p2_table.pk}")
    obj_list[id] = game(id, game_table,p1_table, p2_table)
    print(f"size --- {len(obj_list)}")
    print(f"size --- {len(task_list)}")



async def connect(game_id, channel_name, side):
    if not game_id in obj_list:
        ValueError("no game for you")
    print("trigged connection -*-*-*-")
    await obj_list[game_id].connect(channel_name, side)
    print (f'con task_list {len(task_list)}')
    return obj_list[game_id].group


class game():
    def __init__(self, id,game_db, p1_db, p2_db):
        self.id = id
        self.group = f"group_for_game_{id}"
        self.pid1 = None
        self.pid2 = None
        self.move_allowed = False
        self.p1mv = Player_movment(
            consts['p1StartingPositionX'],
            consts['p1StartingPositionY'],
            consts["p1StartingPositionX"] + consts['playerW'],
        )
        self.p2mv = Player_movment(
            consts['p2StartingPositionX'],
            consts['p2StartingPositionY'],
            consts["p2StartingPositionX"] - (consts['playerW'] + consts['ballSize']),
        )
        self.ball = Ball_movment()
        self.cl = get_channel_layer()
        self.p1gols = 0
        self.p2gols = 0
        self.p1_db = p1_db
        self.p2_db = p2_db
        self.game_db = game_db
        self.golsOrder = ""
        
    async def echo_group(self, task):
        msg = json.dumps(task)
        await self.cl.group_send(self.group, {"type": "chat_message","message": msg})


    async def send_message_by_id(self, task, pid):
        msg = json.dumps(task)
        await self.cl.group_send(self.group, {
            "type": "private_message",
            "id" : pid,
            "message": msg,
        })

    def read_command(self, cmd):
        if cmd['player'] == self.pid1:
            self.p1mv.update_stat(cmd['cmd'], cmd)
        elif cmd['player'] == self.pid2:
            self.p2mv.update_stat(cmd['cmd'], cmd)

    async def connect(self, channel_name, side):
        if side == 1:
            self.pid1 = channel_name
        elif side == 2:
            self.pid2 = channel_name
        await self.cl.group_add(self.group, channel_name)
        await self.identify_players(side)
        await self.update_score()
        if self.move_allowed == True:
            print("allowed on connect")
            await self.activat_movment(self.move_allowed)

    async def loop(self):
        pass
        await self.move_objs()
        await self.round_start()
        while(True):
            # cmd = get_cmd('msg',{"text":f'----\nP1 => w = {self.p1mv.movingUP} | s = {self.p1mv.movingDowm}\n P2 => w = {self.p2mv.movingUP} | s = {self.p2mv.movingDowm} \n----'})
            # await self.echo_group(cmd)
            self.p1mv.applay()
            self.p2mv.applay()
            winer = self.ball.applay(self.p1mv, self.p2mv)
            if winer != 0:
                await self.activat_movment(False)
                await self.round_end(winer)
                self.golsOrder += str(winer)
                print(f"{self.p1gols} golate {self.p2gols}")
                if self.p1gols == 5 or self.p2gols == 5:
                    stat1 = 1 if self.p1gols == 5 else 0
                    stat2 = 1 if self.p2gols == 5 else 0
                    await self.update_score()
                    await self.makewiner(self.pid1, stat1, self.p1gols, self.p2gols)
                    await self.makewiner(self.pid2, stat2, self.p1gols, self.p2gols)
                    print(f"------------> {self.id}")
                    try:
                        
                        await self.setHistoric(stat1 , stat2)
                        print(f"deleteing  --* ")
                        print(f"deleted  --* finish")
                        del obj_list[self.id]
                        await self.cl.group_send(self.group, {"type": "disconnect_event","message": "disconnect"})
                        
                        if self.game_db.type == "turn":
                            pass
                        await asyncio.sleep(1.5)
                        await sync_to_async(self.p1_db.delete)()
                        await sync_to_async(self.p2_db.delete)()
                        await sync_to_async(self.game_db.delete)()
                        return
                    except Exception as e:
                         print(e)
                    # await self.setHistoric(stat1 , stat2)
                    # print(f"{len(obj_list)} **56-*//45")
                    # del obj_list[self.id]
                    # print(f"{len(obj_list)} **finstion")
                    # await self.cl.group_send(self.group, {"type": "disconnect_event","message": "disconnect"})
                    return
                else:
                    await self.update_score()
                    await self.round_start()
                
            
            await self.move_objs()##message to clients
            await asyncio.sleep(0.02)
        # #     break
    
    async def setHistoric(self, p1w, p2w):
        p1name = self.p1_db.login
        p2name = self.p2_db.login
        try:
            p1stats = await sync_to_async(PlayerStats.objects.get)(login=p1name)
            print("found p1")
        except Exception as e:
            print("not found craet new one p1")
            p1stats = PlayerStats()
            p1stats.login = p1name
        try:
            p2stats = await sync_to_async(PlayerStats.objects.get)(login=p2name)
            print("found p2")
        except Exception as e:
            print("not found craet new one p2")
            p2stats = PlayerStats()
            p2stats.login = p2name
        print("aa**adda")
        p1stats.games_played += 1
        p1stats.wins += p1w
        p1stats.loss += p2w
        p1stats.goals_scored   += self.p1gols
        p1stats.goals_conceded += self.p2gols

        p2stats.games_played += 1
        p2stats.wins += p1w
        p2stats.loss += p2w
        p2stats.goals_scored   += self.p2gols
        p2stats.goals_conceded += self.p1gols

        glogs = PonGames()
        glogs.gamename = f"{p1name} {p2name}"
        glogs.player1 = p1name
        glogs.player2 = p2name
        glogs.goals_order = self.golsOrder
        glogs.p1goal = self.p1gols
        glogs.p2goal = self.p2gols
        if (p1w == 1):
            glogs.winner = p1name
        else :
            glogs.winner = p2name
        print(f"{p1stats.login} -- and  -- {p2stats.login} -- on -- {glogs.gamename}")
        await sync_to_async(p1stats.save)()
        await sync_to_async(p2stats.save)()
        await sync_to_async(glogs.save)()

        
    async def round_end(self, winner):
        
        await self.activat_movment(False)
        self.p1gols += 1 if winner == 1 else 0
        self.p2gols += 1 if winner == 2 else 0
        dir = 1 if winner == 1 else -1 if winner == 2 else 1
        self.ball.reset(dir)
        self.p1mv.reset()
        self.p2mv.reset()
        await self.move_objs()


    async def round_start(self):
        
        for i in range(3, 0, -1):
            await self.countDown(i)
            await asyncio.sleep(1)
        await self.activat_movment(True)
        await self.countDownEnd()

    async def makewiner(self, pid, stat, p1s,  p2s):
        msg = "Win !!" if stat == 1 else "Lose !!"
        cmd = get_cmd('match_end',{"msg": msg, "reson" : f"{p1s} - {p2s}"})
        await self.send_message_by_id(cmd ,pid)

    async def update_score(self):
        
        cmd = get_cmd('update_score',{"p1": self.p1gols, "p2" : self.p2gols})
        await self.echo_group(cmd)
    
    async def countDown(self, time):
        cmd = get_cmd('count_down',{"time": time})
        await self.echo_group(cmd)

    async def countDownEnd(self):
        cmd = get_cmd('count_down_end',{"none": None})
        await self.echo_group(cmd)

    async def identify_players(self, side):
        cmd = get_cmd('pannel',{
                    "login1" : self.p1_db.login,
                    "login2" : self.p2_db.login,
                    "iamge1" : self.p1_db.imageURL,
                    "iamge2" : self.p2_db.imageURL,
                })
        if side == 1:
            await self.send_message_by_id(cmd, self.pid1)
        else :
            await self.send_message_by_id(cmd, self.pid2)
    
    async def activat_movment(self, allow):
        self.move_allowed = allow
        cmd = get_cmd('allow_move',{'allowed' : allow})
        await self.echo_group(cmd)
    
    async def move_objs(self):
        cmd = get_cmd(
            'move_objs',
            {
                'p1' : self.p1mv.getY(),
                'p2' : self.p2mv.getY(),
                'ballX': self.ball.getX(),
                'ballY': self.ball.getY(),
            })
        await self.echo_group(cmd)
