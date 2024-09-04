from datetime import datetime
import requests
import asyncio
import time
from .consts import gameContants as consts
import math
from .player import Player_movment

class Ball_movment():
    def __init__(self):
        self.x = consts["ballStartingPositionX"]
        self.y = consts["ballStartingPositionY"]
        self.vx = consts["ballStartVx"]
        self.vy = consts["ballStartVy"]
        self.Speed = consts['ballSpeed']
        self.SpeedMaxVY = consts['ballmaxVY']
        self.ballRebound = False
        self.balldest = None

    def reset(self, dir):
        self.x = consts["ballStartingPositionX"]
        self.y = consts["ballStartingPositionY"]
        self.vy = consts["ballStartVy"]
        self.vx = dir * consts["ballStartVx"]

    def nextReboundPointX(self):
        all_possible_impact_points = [
            consts["bMinX"],
            consts["p1StartingPositionX"] + consts['playerW'],
            consts["p2StartingPositionX"] - (consts['playerW'] + consts['ballSize']),
            consts["bMaxX"]
        ]
        ft_filter = lambda ele, val: ele > val if self.vx >= 0 else ele < val
        ft_select = min if self.vx >= 0 else max
        val = ft_select(filter(lambda ele: ft_filter(ele, self.x), all_possible_impact_points))
        return val

    def getX(self):
        return self.x

    def getY(self):
        return self.y

    def set_direction(self, new_dir):
        print(f"after pleyer esect = {new_dir}")
        self.vx = new_dir["vx"]
        self.vy = new_dir["vy"]
        # sx = -1 if self.vx < 0 else 1
        # sy = -1 if self.vy < 0 else 1
        # if self.vy > self.SpeedMaxVY:
        #     self.vx = self.SpeedMaxVY
        #     self.vy = math.sqrt(math.pow(self.Speed, 2) - math.pow(self.vx , 2))
        self.adjust_speed()
        print(f"final dir {self.vx} {self.vy}")
   
    def lower_speed_to_stop_on_point(self, limit_x):
        self.x -= self.vx
        self.y -= self.vy
        
        sx = 1
        if self.vx < 0 : sx = -1

        sy = 1
        if self.vy < 0 : sy = -1

        newVx = abs(limit_x - self.x) * sx
        newVy = (newVx / abs(self.vx) * self.vy) * sy
        self.x += newVx
        self.y += newVy
        

    def move(self, limit_x):
        self.x += self.vx
        self.y += self.vy

        # Prevent ball from crossing x
        self.x = consts["bMaxX"] if self.x > consts["bMaxX"] else self.x
        self.x = consts["bMinX"] if self.x < consts["bMinX"] else self.x

        # Prevent ball from crossing y
        self.y = consts["bMaxY"] if self.y > consts["bMaxY"] else self.y
        self.y = consts["bMinY"] if self.y < consts["bMinY"] else self.y

        # Get the proper value for ball display
        if self.vx > 0 and self.x > limit_x:
            self.lower_speed_to_stop_on_point(limit_x)
        if self.vx < 0 and self.x < limit_x:
            self.lower_speed_to_stop_on_point(limit_x)

    def adjust_speed(self):
        current_speed = math.sqrt(math.pow(self.vx, 2) + math.pow(self.vy, 2))
        scale = float(self.Speed / current_speed)
        self.vx *= scale
        self.vy *= scale
        print (f"ax vy is  {consts['ballmaxVY']} . curent is {self.vy}")
        # if self.vy < 0: sy = -1
        # else : sy = 1
        # if self.vx < 0: sx = -1
        # else : sx = 1

        # self.vy = consts["ballmaxVY"] * sy
        # self.vx = math.sqrt(math.pow(consts["ballSpeed"], 2) - math.pow(consts["ballmaxVY"], 2)) * sx
        print(f"speed adjused vx to {self.vx} vy to {self.vx}")  

    def ballOnRoof(self):
        return self.y == 0 or self.y == consts['bMaxY']

    def ReboundBall(self, p1, p2):
        if p1.hitPonitX == self.x:#if ball should hit player 1
            if p1.hitsBall(self.x, self.y):
                self.set_direction(p1.getPlayerAffectOnBall(self))
                p1.reset_aim()
        elif p2.hitPonitX == self.x:#if ball should hit player 2
            if p2.hitsBall(self.x, self.y):
                self.set_direction(p2.getPlayerAffectOnBall(self))
                p2.reset_aim()
        elif self.x == consts['bMinX']:
            print("GOAL 2")
            return 2
        elif self.x == consts['bMaxX']:
            print("GOAL 1")
            return 1
        else:
            print("boundce")
            self.vy *= -1
        return 0
    
    def applay(self, p1, p2):
        # print("---start")
        #case to enter: ball obj is in open space (no colising is happening)
        if not self.ballRebound:
            # print("no rebound --")
            #call culated the next x position for ball if its not set
            if self.balldest is None:
                self.balldest = self.nextReboundPointX()
            self.move(self.balldest)#move ball
            if self.x == self.balldest or self.ballOnRoof():
                #checks if a closion should happen
                self.ballRebound = True
                self.balldest = None
        #case to enter : ball is ontop of a player or wall 
        #the rebound effect will be callculaed
        if self.ballRebound:
            # print("reboud --")
            self.ballRebound = False
            return self.ReboundBall(p1, p2)
        # print("---end")
        #return 1 or 2 if some 1 scored 0 if nothig happend
        return 0
