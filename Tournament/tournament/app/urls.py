from django.urls import path, include
from . import views

urlpatterns = [
    path('trn_subscribe/', views.trn_subscribe),
    path('is_inTourn/', views.is_intorn),
    path('tourn_info/', views.tourn_info),
    path('leave_trn/', views.leave_trn),
    path('trn_history/', views.tourn_history),
    path('trn_stats/', views.trn_stats),
    path('matchresult/', views.matchresult),
    path('matche_info/', views.matche_info),
    # path('matches', matches.start_matche, name='start_matche'),trn_stats
]
