from django.urls import path

from .views import ItemListCreateView, ItemRetrieveUpdateDestroyView, DeleteImageView

urlpatterns = [
    path('items/', ItemListCreateView.as_view(), name='item-list-create'),
    path('items/new/', ItemListCreateView.as_view(), name='item-list-create'),
    path('items/<str:pk>/', ItemRetrieveUpdateDestroyView.as_view(), name='item-detail'),
    path('items/delete-image/<str:pk>', DeleteImageView.as_view(), name='delete-character-image'),
]
