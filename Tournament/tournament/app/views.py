from django.http import HttpResponse
from .models import Tournament, Matche, Player
from .tournament import tourn_subscribing, is_user_subscribe
from .tournament import send_tournament_update
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .enums import Round, Tourn_status, M_status
from .matches import save_matche, in_matche


@api_view(['POST'])
@permission_classes([AllowAny])
def is_intorn(request):
    if request.method == 'POST':
        user_id = request.data['user']['id']
        plyr = is_user_subscribe(user_id)
        if plyr:
            print('user: ', plyr.username, ' in TOURN', flush=True)
            trn_size = plyr.tournament.size
            response = {
                'intourn': 'yes',
                'trn_size': trn_size,
            }
            if plyr.tournament.status == Tourn_status.ST.value:
                if in_matche(user_id) is None:
                    print('user:  not in TOURN', flush=True)
                    response = {
                        'intourn': 'no',
                        'trn_size': 0,
                    }
                
        else:
            print('user:  not in TOURN', flush=True)
            response = {
                'intourn': 'no',
                'trn_size': 0,
            }
        return HttpResponse(json.dumps(response),
            content_type='application/json')
    return (HttpResponse("la"))



@api_view(['POST'])
@permission_classes([AllowAny])
def trn_subscribe(request):
    if request.method == 'POST':
        data = request.data
        trn_size = int(request.GET.get('trn_size'))
        trn = tourn_subscribing(request, data, trn_size)
        if trn and trn.status == Tourn_status.PN.value:
            send_tourn_info(trn_size)
        if trn and trn.status == Tourn_status.ST.value:
            response = generate_matche_response(trn)
            return HttpResponse(json.dumps(response),
            content_type='application/json')

        trn = Tournament.objects.filter(size=trn_size).latest('id')
        # print('TRN_time', trn.create_date.isoformat(), flush=True)
        players = generate_tourn_response(trn)
        return HttpResponse(json.dumps(players),
            content_type='application/json')


@api_view(['POST'])
@permission_classes([AllowAny])
def leave_trn(request):
    if request.method == 'POST':
        data = request.data
        user_id = data['user']['id']
        try:
            trn = Tournament.objects.filter(size=4).latest('id')
            plyr = Player.objects.get(profile_id=user_id, tournament=trn)
        except:
            try:
                trn = Tournament.objects.filter(size=8).latest('id')
                plyr = Player.objects.get(profile_id=user_id, tournament=trn)
            except:
                return HttpResponse(json.dumps({'status':'ko'}),
            content_type='application/json')
        plyr.delete()
        send_tourn_info(trn.size)
        send_tournament_update(trn, 'leave_trn')
        return HttpResponse(json.dumps({'status':'ok'}),
            content_type='application/json')


def generate_tourn_response(trn: Tournament):
    data = trn.trn_players.all()
    playerslist = []
    for player in data:
        playerslist.append({
            'image_url': player.img_url,
            'username': player.username,
        })
    
    resp_data = {
        'type': 'remotTrn',
        'created': 'true',
        'players': playerslist,
        'unknown': trn.size - len(playerslist),
        'trn_name': trn.name,
        'trn_size': trn.size,
        'create_time': trn.create_date.isoformat(),
    }
    print('isoformat: ---> ', trn.create_date.isoformat(), flush=True)
    return resp_data


def generate_matche_response(trn: Tournament):
    matches = Matche.objects.filter(tourn=trn, round=trn.round)
    trn_matches = []
    for m in matches:
       
        trn_matches.append({
            'p1_img':m.player1.img_url,
            'p1_name':m.player1.name,
            'p1_pr_id':m.player1.profile_id,
            'p2_img':m.player2.img_url,
            'p2_name':m.player2.name,
            'p2_pr_id':m.player2.profile_id,
            'create_time': m.created_at.isoformat(),
        })
    resp_data = {
        'type': 'matche',
        'm_res': 'win',
        'refresh': 'false',
        'matches': trn_matches,
        'trn_name': trn.name,
    }
    return resp_data


def tourn_info(request):
    if request.method == 'GET':
        trn_size = int(request.GET.get('trn_size'))
        try:
            trn = Tournament.objects.filter(size=trn_size).latest('id')
            players = generate_tourn_response(trn)
            # print('TORN_STATUS: ', trn.status, flush=True)
            pn = Tourn_status.PN
            if trn.status == pn.value or trn.status == pn.name:
                return HttpResponse(json.dumps(players),
                    content_type='application/json')
        except:
            pass
    return HttpResponse(json.dumps({'type':'tourn', 'created': 'false'}),
        content_type='application/json')


def send_tourn_info(trn_size):
    channel_layer = get_channel_layer()
    room_group_name = 'tournament_info'
    try:
        trn = Tournament.objects.filter(size=trn_size).latest('id')
        players = generate_tourn_response(trn)
        players['type'] = 'tourn_info'
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            players,
        )
        return
    except:
        pass
    async_to_sync(channel_layer.group_send)(
        room_group_name,
        {
            'type': 'tourn_info', 
            'created': 'false',
        },
    )

def trn_history_response(trn: Tournament):
    matches = trn.matches.all()
    matche_list = []
    for matche in matches:
        matche_list.append({
            'p1': {
                'name': matche.player1.name,
                'img': matche.player1.img_url,
                'profile_id': matche.player1.profile_id,
                'score': matche.p1_score,
                'won': matche.winner == matche.player1,
            },
            'p2': {
                'name': matche.player2.name,
                'img': matche.player2.img_url,
                'profile_id': matche.player2.profile_id,
                'score': matche.p2_score,
                'won': matche.winner == matche.player1,
            },
            'round': matche.round,
        })
    response = {
        'trn_name': trn.name,
        'trn_id': trn.id,
        'size': trn.size,
        'matches': matche_list,
    }
    return response

def tourns_list(plyr_trns, pr_id):
    tourns = []
    for trn in plyr_trns:
        try:
            matche = trn.matches.get(round=Round.FN.value)
            won = pr_id == matche.winner.profile_id
        except:
            won = False
        tourns.append({
            'STAUS': trn.status,
            'id': trn.id,
            'name': trn.name,
            'size': trn.size,
            'won': won,
        })
    response = {
        'trns_len': len(tourns),
        'trns': tourns,
    }
    return response

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def tourn_history(request):
    if request.method == 'POST':
        data = request.data
        user_id = data['user']['id']
        plyr_trns = get_plyr_trns(user_id)
        response = tourns_list(plyr_trns, user_id)
        return HttpResponse(json.dumps(response),
            content_type='application/json')

    if request.method == 'GET':
        trn_id = request.GET.get('trn_id')
        trn = Tournament.objects.get(id=trn_id)
        response = trn_history_response(trn)
        return HttpResponse(json.dumps(response),
            content_type='application/json')

    return HttpResponse(json.dumps({'id':0}),
            content_type='application/json')

def get_plyr_trns(user_id):
    players = Player.objects.filter(profile_id=user_id)
    plyr_trns = []
    for plyr in players:
        if plyr.tournament.status == Tourn_status.ST.value:
            plyr_trns.append(plyr.tournament)
    return plyr_trns

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def trn_stats(request):
    if request.method == 'POST':
        data = request.data
        user_id = data['user']['id']
        plyr_trns = get_plyr_trns(user_id)
        players = Player.objects.filter(profile_id=user_id)
        wins = 0
        goals_achieved = 0
        goals_received = 0
        losses = 0
        for plyr in players:
            if plyr.won:
                wins += 1
            else:
                losses += 1
            goals_achieved += plyr.goals_achieved
            goals_received += plyr.goals_received
        return HttpResponse(json.dumps({'wins': wins, 'losses': losses,
            'goals_achieved': goals_achieved, 'goals_received': goals_received}),
            content_type='application/json')
    return HttpResponse(json.dumps({'wins': 0, 'losses': 0}),
            content_type='application/json')


@api_view(['POST'])
@permission_classes([AllowAny])
def matchresult(request):
    print("-----------------ad------------------------",flush=True)
    print(request.method,flush=True)
    if request.method == 'POST':
        try :
            data = json.loads(request.body)
            print("game result recived", flush=True)
            print(data, flush=True)
            save_matche(data)
        except Exception as e:
            print(e)
            return HttpResponse("error")
    return HttpResponse("well recived")


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def matche_info(request):
    if request.method == 'GET':
        m_id = request.GET.get('m_id')
        matche = Matche.objects.get(id=m_id)
        m = Matche.objects.get(p1_score=0)
        print('Matche: ', matche, flush=True)
        return HttpResponse(json.dumps({'matche': {
            'm_id': matche.pk,
            'player1': matche.player1.name,
            'player2': matche.player2.name,
            'p1_score': matche.p1_score,
            'p2_score': matche.p2_score,
            'winner': matche.winner.username,
            'round': matche.round,
        }}),
            content_type='application/json')
    return HttpResponse('Error')

