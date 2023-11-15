from django.contrib import admin
from django.urls import include, path

from . import views

app_name = "notifications"

urlpatterns = [
    path('', views.NotifList.as_view(), name="notifs"),
    path('<int:notif_id>/', views.Notif.as_view(),
         name="notif")
]
