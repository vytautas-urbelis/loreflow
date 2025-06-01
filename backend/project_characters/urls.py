# urls.py
from django.urls import path

from .views import CharacterViewSet, CreateExtractedCharacterViewSet, CreateNewCharacterViewSet, \
    DeleteImageView

urlpatterns = [
    # path('chat/', ChatViewSet.as_view(), name='chat-stream'),
    path('character/<str:pk>', CharacterViewSet.as_view(),
         name='retrieve-update-delete-character'),
    path('character/', CreateExtractedCharacterViewSet.as_view(), name='characters-from-pdf'),
    path('character/new/', CreateNewCharacterViewSet.as_view(), name='create-new-character'),
    path('character/delete-image/<str:pk>', DeleteImageView.as_view(),
         name='delete-character-image'),
]
