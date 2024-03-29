"""
URL configuration for petpal project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

from . import views

app_name = "comments"

urlpatterns = [
    path('application/<int:application_id>/', views.CommentView.as_view(), name="application"),
    path('shelter/<int:shelter_id>/', views.ReviewView.as_view(), name="shelter"),
    path('shelter/<int:shelter_id>/<int:parent_review_id>/', views.ReviewView.as_view(), name="shelter-response"),
]
