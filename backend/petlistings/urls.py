from django.urls import path
from . import views

app_name='petlistings'
urlpatterns = [
    path('listing/', views.Listing.as_view(), name='listing'),
    path('listing/<int:pk>/', views.ManageListing.as_view(), name='manage'),
    path('filters/', views.Filters.as_view(), name='filters'),
]