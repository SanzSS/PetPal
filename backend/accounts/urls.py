from django.urls import path

from .views import AccountsCreate, ShelterList, UpdateAccount
from . import views

app_name = "accounts"

urlpatterns = [
    path("", AccountsCreate.as_view(), name="account-create"),
    path("shelters/", ShelterList.as_view(), name="shelter-list"),
    path("<int:shelter_id>/delete/", views.delete, name="shelter_delete"),
    path("update/", UpdateAccount.as_view(), name="update_account"),
]
