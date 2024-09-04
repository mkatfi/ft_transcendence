from channels.layers import get_channel_layer
from .models import Tournament, Matche
from .enums import Round, M_status, Tourn_status
from django.shortcuts import render
from asgiref.sync import async_to_sync




def create_matches(tourn: Tournament):
    print('create_matches', flush=True)
    players = tourn.trn_players.all()
    won_players = [plyr for plyr in players if plyr.won] 
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


def create_matche(p1, p2, trn):
    mtch = Matche.objects.create(tourn=trn)
    mtch.player1 = p1
    mtch.player2 = p2
    mtch.round = trn.round
    mtch.status = M_status.UNP.value
    mtch.save()


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


def is_round_finish(_matche: Matche):
    tourn = _matche.tourn
    matches = tourn.matches.filter(round=_matche.round)
    end_matche = matches.filter(status=M_status.PLY.value)
    if matches.count() == end_matche.count():
        return True
    return False


def save_matche(mtche):
    mtch = Matche.objects.get(id=mtche.m_id)
    mtch.p1_score = mtche.p1_score
    mtch.p2_score = mtche.p2_score
    mtch.status = M_status.PLY.value
    mtch.save()
    if is_round_finish(mtch):
        new_round(mtch.tourn)


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


