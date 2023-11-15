from django.urls import path

from .views import ApplicationsCreateView, ApplicationsUpdateGetView, ApplicationsListView

app_name = "applications"

urlpatterns = [
    path("pet/<int:petlisting_id>/", ApplicationsCreateView.as_view(), name="application-create"),
    path("<int:application_id>/", ApplicationsUpdateGetView.as_view(), name="application-get-update"),
    path("", ApplicationsListView.as_view(), name="application-list"),
]
