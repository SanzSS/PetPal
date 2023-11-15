from django.urls import path

from .views import ApplicationsView, ApplicationsListView

app_name = "applications"

urlpatterns = [
    path("<int:petlisting_id>/", ApplicationsView.as_view(), name="application"),
    path("", ApplicationsListView.as_view(), name="application-list"),
]
