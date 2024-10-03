from channels.layers import get_channel_layer
from .models import Tournament, Matche, Player
from .enums import Round, M_status, Tourn_status
from django.shortcuts import render
from asgiref.sync import async_to_sync
import requests
from django.db.models import Q




def create_matches(tourn: Tournament):
    print('create_matches', flush=True)
    players = tourn.trn_players.all()
    won_players = [plyr for plyr in players if plyr.won]
    print("----WINNERS----")
    for p in won_players:
        print('     plyr_name', p.username, flush=True)
    if len(won_players) == 1:
        tourn.status = Tourn_status.EN.value
        tourn.save()
        return
    p1 = None
    p2 = None
    i = 1
    for p in won_players:
        if i % 2 == 1:
            p1 = p
        else:
            p2 = p
            create_matche(p1, p2, tourn)
        i += 1


#abid added this
def send_Request_to_Game_service(p1, p2, trnpk, mtchpk):
    url = 'http://game:8000/api/create/'
    data = {
        'm_id': mtchpk,
        't_id': trnpk,
        'player1' : p1.username,
        'player2' : p2.username,
        'type'    : "tourn",
    }
    res = requests.post(url=url,json=data)
    return res

def in_matche(user_id):
    plyr = Player.objects.get(profile_id=user_id)
    plyr_matches = Matche.objects.filter(Q(player1=plyr) | Q(player2=plyr))
    unp_plyr_matches = plyr_matches.filter(status=M_status.UNP.value)
    if len(unp_plyr_matches) == 1:
        for m in unp_plyr_matches:
            return m
    return None


def create_matche(p1, p2, trn):
    tourn_warn(p1)
    tourn_warn(p2)
    mtch = Matche.objects.create(tourn=trn)
    mtch.player1 = p1
    mtch.player2 = p2
    mtch.round = trn.round
    mtch.status = M_status.UNP.value
    mtch.save()
    # abid added this
    send_Request_to_Game_service(p1, p2, trn.pk,mtch.pk)
    print("create matche")



def send_match_start(trn: Tournament, refresh):
    channel_layer = get_channel_layer()
    group_name = f'trnGroup_{trn.pk}'
    trn_name = trn.name
    print('send_match_start to : ', group_name, flush=True)
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "start_matche",
            'refresh': refresh,
            "trn_id": trn.pk,
            'trn_name': trn_name,
        }
    )


def is_round_finish(matche: Matche):
    tourn = matche.tourn
    matches = tourn.matches.filter(round=matche.round)
    end_matche = matches.filter(status=M_status.PLY.value)
    if matches.count() == end_matche.count():
        return True
    return False


def save_matche(matche_res):
    print('matche id: ', matche_res['m_id'], flush=True)
    winner = Player.objects.get(username=matche_res['winer'])
    loser = Player.objects.get(username=matche_res['loser'])

    loser.won = False
    loser.save()
    matche = Matche.objects.get(id=matche_res['m_id'])
    matche.winner = winner
    matche.p1_score = matche_res['p1_goals']
    matche.p2_score = matche_res['p2_goals']
    matche.status = M_status.PLY.value
    matche.save()
    print('after matche save')
    print('p1: ',matche.player1, '|p2: ',matche.player1,
        '|W: ', matche.winner, flush=True)
    if is_round_finish(matche):
        new_round(matche.tourn)
    # matche.player1.goals_achieved += matche_res.p1_goals
    # matche.player1.goals_received += matche_res.p2_goals
    # matche.player2.goals_achieved += matche_res.p2_goals
    # matche.player2.goals_received += matche_res.p1_goals


def update_round(trn : Tournament):
    if trn.round == Round.QU.value:
        trn.round = Round.HF.value
        trn.save()
    if trn.round == Round.HF.value:
        trn.round = Round.FN.value
        trn.save()


def new_round(trn):
    update_round(trn)
    create_matches(trn)
    matches = Matche.objects.filter(status=M_status.UNP.value)
    for m in matches:
        print('matche_id: ', m.id, ' {',
            m.player1.profile.user.username, ' VS ',
            m.player1.profile.user.username, "}", flush=True)
    return trn


def tourn_warn(plyer: Player):
    user_id = plyer.profile_id
    channel_layer = get_channel_layer()
    room_name = f'chat_{user_id}'
    async_to_sync(channel_layer.group_send)(
        room_name,
        {
            'type': 'new_msg',
            'msg_id': -1,
            'sender_id': -1,
            'receiver_id': -1,
            'msg_text': 'tourn_warn',
            'unread_msgs': 0,
            'all_unread_msgs': 0,
        }
    )
    print('######## send toun warn to', plyer.username,' ########', flush=True)