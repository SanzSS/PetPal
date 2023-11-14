from django.urls import path

from .views import ApplicationsCreate

app_name = "applications"

urlpatterns = [
    path("<int:petlisting_id>/", ApplicationsCreate.as_view(), name="application-create"),
]
