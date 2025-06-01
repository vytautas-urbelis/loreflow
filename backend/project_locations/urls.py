from django.urls import path

from .views import LocationView, LocationUpdateDeleteView, DeleteImageView

urlpatterns = [
    path('locations/', LocationView.as_view(), name='location-list'),
    path('locations/new/', LocationView.as_view(), name='location-list'),
    path('locations/<str:pk>/', LocationUpdateDeleteView.as_view(), name='item-detail'),
    path('locations/delete-image/<str:pk>', DeleteImageView.as_view(),
         name='delete-character-image'),
]
