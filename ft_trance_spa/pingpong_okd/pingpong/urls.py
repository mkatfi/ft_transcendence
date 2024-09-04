"""
URL configuration for pingpong project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path ,include
from django.conf import settings
from django.conf.urls.static import static
from usercontent.views import MyTokenObtainPairView,  is_auth, getUser

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('usercontent.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('remoteauth/', include('remote_auth.urls')),
    # path('api/', include('api.urls')),
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/',TokenRefreshView.as_view(), name='token_refresh'),
    path('api/is_auth/', is_auth),
    path("api/getUser/", getUser, name="get_user"),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
 