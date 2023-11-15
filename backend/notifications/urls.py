from django.contrib import admin
from django.urls import include, path

from . import views

app_name = "notifications"

urlpatterns = [
    path('seeker/<int:seeker_id>/', views.NotifSeekerList.as_view(), name="seeker_notifs"),
    path('shelter/<int:shelter_id>/', views.NotifShelterList.as_view(), name="shelter_notifs"),
]
