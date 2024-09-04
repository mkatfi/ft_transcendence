
from django.urls import path, include

urlpatterns = [
    path("online/", include("online.urls")),
    path("api/", include("api.urls")),
]
