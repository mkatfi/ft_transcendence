import json
from datetime import datetime
import requests
import asyncio
import time
from .match_making_api import get_cmd
from .consts import gameContants as consts
import math

class Player_movment():
    def __init__(self, x, y , hitX):
        self.hitPonitX = hitX
        self.x      = x
        self.y      = y
        self.aimX   = None
        self.aimY   = None
        self.movingUP   = False
        self.movingDowm = False

        self.hitBox = {
                'min'   : 0,
                'max'   : consts['pSize']
            }
        self.startPx      = self.x
        self.startPy      = self.y
        self.speed = consts['playerSpeed']
  

    #input handler
    def update_stat(self, event, dict):
        if event == "key_relese" or event == "key_press":
            mv = False
            if event == "key_relese":
                mv = False
            elif event == "key_press":
                mv = True
            
            if dict['key'] == 'w':
                self.movingUP = mv
            elif dict['key'] == 's':
                self.movingDowm = mv
    
        elif event == "mouse_press":
            self.aimX = dict['x']
            self.aimY = dict['y']


    def reset_aim(self):
        self.aimX   = None
        self.aimY   = None
    
    def reset(self):
        self.x = self.startPx
        self.y = self.startPy
        self.movingUP   = False
        self.movingDowm = False
        self.reset_aim()

    def moveUP(self):
        self.y -= self.speed
        if self.y < consts['pMinPos']:
            self.y = consts['pMinPos']
    
    def moveDown(self):
        self.y += self.speed
        if self.y > consts['pMaxPos']:
            self.y = consts['pMaxPos']

    def getY(self):
        return self.y
    

    def set_aim_point(self, ball, newV):
        print ("affecting ball --------------***")
        print(f"ball vec {ball.vx}, {ball.vy} , aim point {self.aimX} {self.aimY}")
        px = ball.x
        py = ball.y
        if self.x == consts['p1StartingPositionX']:
            if self.x >= self.aimX:
                print("not allowed for p1 ++")
                self.aimX = None
                self.aimY = None
                return newV
        elif self.x == consts['p2StartingPositionX']:
            if self.x <= self.aimX:
                print("not allowed for p2 ++")
                return newV
        bigvx = self.aimX - px
        bigvy = self.aimY - py
        print(f"bvx :{bigvx} , bvy :{bigvy}")
        bigSpeed = math.sqrt(math.pow(bigvx , 2) + math.pow(bigvy, 2))
        scale = float(consts['ballSpeed'] / bigSpeed)
        if abs(bigvy) > 0.5*abs(bigvx):
            sx = 1
            if bigvx<0 : sx = -1
            sy = 1
            if bigvy<0 : sy = -1
            newV['vx'] = sx * bigSpeed / math.sqrt(2)
            newV['vy'] = sy * bigSpeed / math.sqrt(2)
        else:
            newV['vx'] = bigvx * scale
            newV['vy'] = bigvy * scale
        print(f"set aim point = {newV}")
        return newV

    def getPlayerAffectOnBall(self, ball):
        newVy = ball.vy
        newVx = ball.vx * -1
        print(f"original dir = {ball.vx} , {ball.vy}") 
        if self.aimX != None:
            print("player have  aim effect++++")
            return self.set_aim_point(ball, {'vx': newVx, 'vy': newVy})
        print("player no aim effect-----")
        return {'vx': newVx, 'vy': newVy}

    def hitsBall(self, x, y):
        if self.hitPonitX != x:
            return False
        y = y - self.y
        print("hit ball")
        return   y + consts["ballSize"] >= self.hitBox['min'] and y <= self.hitBox['max']


    def applay(self):
        if self.movingUP == True:
            self.moveUP()
        if self.movingDowm == True:
            self.moveDown()

