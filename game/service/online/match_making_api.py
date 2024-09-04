import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
import requests
import asyncio
import time

def queue_up(channel_name, login):
    url = "http://matchmaking:8000/put_in_queue/"
    body = {
        "channel_id" : channel_name,
        "login"      : login
    }
    res = requests.post(url, json.dumps(body) ,headers={"Content-Type" : 'application/json'})
    if res.status_code != 200:
        raise ValueError("errr")
    return res.content
    
def in_queue(channel_name,login):
    url = "http://matchmaking:8000/in_queue/"
    body = {
        "channel_id" : channel_name,
        "login"      : login
    }
    res = requests.post(url, json.dumps(body) ,headers={"Content-Type" : 'application/json'})
    if res.status_code != 200:
        raise ValueError("errr")
    return str(res.content)

def quit_queue(channel_name,login):
    url = "http://matchmaking:8000/quit_queue/"
    body = {
        "channel_id" : channel_name,
        "login"      : login
    }
    res = requests.post(url, json.dumps(body) ,headers={"Content-Type" : 'application/json'})
    if res.status_code != 200:
        print (res)
        raise ValueError("errr")
    return str(res.content)

def get_cmd(cmd_type, params):
    cmd = {
        'cmd': cmd_type,
    }
    cmd.update(params) 
    return cmd

