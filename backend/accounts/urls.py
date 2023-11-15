from django.urls import path

from .views import AccountsCreate, ShelterList
from . import views

app_name = "accounts"

urlpatterns = [
    path("", AccountsCreate.as_view(), name="account-create"),
    path("shelters/", ShelterList.as_view(), name="shelter-list"),
    path("<int:user_id>/", views.GetAccount.as_view(), name="get-account")
]
