from django.urls import path

from .views import ApplicationsView

app_name = "applications"

urlpatterns = [
    path("<int:petlisting_id>/", ApplicationsView.as_view(), name="application-create"),
]
