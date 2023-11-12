from django.urls import path

from .views import AccountsCreate

app_name = "accounts"

urlpatterns = [
    path("", AccountsCreate.as_view(), name="account-create"),
]
