from django.contrib import admin
from django.urls import include, path

from . import views

app_name = "notifications"

urlpatterns = [
    path('', views.NotifList.as_view(), name="notifs"),
    path('<int:notif_id>/', views.UpdateNotif.as_view(),
         name="update_shelter_notif"),
    path('delete/<int:notif_id>/', views.Delete.as_view(), name="delete-notif")

]
