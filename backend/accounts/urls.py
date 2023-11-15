from django.urls import path

from .views import AccountsCreate, ShelterList, UpdateAccount, Delete
from . import views

app_name = "accounts"

urlpatterns = [
    path("", AccountsCreate.as_view(), name="account-create"),
    path("shelters/", ShelterList.as_view(), name="shelter-list"),
    path("<int:shelter_id>/delete/", Delete.as_view(), name="shelter_delete"),
    path("update/", UpdateAccount.as_view(), name="update_account"),
    path("<int:user_id>/", views.GetAccount.as_view(), name="get-account")
]
