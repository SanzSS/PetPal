from django.contrib import admin
from django.urls import include, path

from . import views

app_name = "notifications"

urlpatterns = [
    path('', views.NotifList.as_view(), name="notifs"),
    path('unread/', views.FilterUnread.as_view(), name="unread_notifs"),
    path('read/', views.FilterRead.as_view(), name="read_notifs"),
    path('<int:notif_id>/', views.UpdateNotif.as_view(),
         name="update_shelter_notif")

]
