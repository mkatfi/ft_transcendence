from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from online.models import Player, InGame
from online.online import add_to_task_list
from rest_framework.views import APIView
import requests
import json
from online.is_auth import is_auth, is_auth2
# Create your views here.
def get_game_view(request):
    return render(request,"view.html")

def create_players(player, side):
    print("triggered --------*- a*d-a*-------------")
    url = "http://django:8000/api/getUser/"
    headers = {'Content-Type': 'application/json'}  # Adjust headers as needed
    body = {"login"      : player}
    response = requests.post(url, json.dumps(body), headers=headers)
    print(response)
    if response.status_code != 200:
        raise ValueError(f"responce error {response.status_code}")
    # print(response.content)
    val = json.loads(response.content)
    obj = Player()
    obj.login = player
    obj.channel_id = None
    obj.is_connected = False
    obj.side = side
    obj.imageURL = val.get('image')
    obj.save()
    return obj

def player_check(p1, p2):
    a1 =  Player.objects.filter(login=p1).exists()
    a2 =  Player.objects.filter(login=p2).exists()
    if a1 == True or a2 == True:
        raise ValueError("not allowed")
    


@csrf_exempt
def creat_game(requst):
    res  = {
        'msg': 'error',
        'code' : 1
    }
    try :
        body = json.loads(requst.body)
        if body['player1'] == body['player2']:
            raise ValueError("not allowed")
        player_check(body['player1'], body['player2'])
        p1 = create_players(body['player1'], 1)
        p2 = create_players(body['player2'], 2)
        obj = InGame()
        obj.player1         = p1.login
        obj.player2         = p2.login
        obj.round           = 1
        obj.game_started    = False
        obj.type            = "noraml"
        if "type" in body:
            obj.type = body['type']
        obj.save()
        print('----------------------------------')
        print(obj.pk)
        print('----------------------------------')
        add_to_task_list(obj.pk,obj ,p1, p2)
        res['msg'] = "created"
        res['code'] = 1
        return HttpResponse(json.dumps(res), content_type='application/json')

    except Exception as e:
        print(e)
        print("failed --------------")
        return HttpResponse(json.dumps(res), content_type='application/json')
    
class is_in_game(APIView):
    def post(self, request):
        try:
            players = Player.objects.all()
            print("all players = ")
            print(players)
            data = json.loads(request.body)
            name = data.get('login')
            token = data.get('access_token')
            if is_auth(data) == True:
                pass
            # return HttpResponse('NO')
            
            p = Player.objects.get(login = name)
            
            print("sending YES")
            return HttpResponse('YES')
        except Exception as e:
            print(e)
            print("sending NO")
            return HttpResponse('NO')