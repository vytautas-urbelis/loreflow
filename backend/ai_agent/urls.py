from django.urls import path
from .views import CharactersFromPdfView

urlpatterns = [
    # path('chat/', ChatViewSet.as_view(), name='chat-stream'),
    path('create-characters/', CharactersFromPdfView.as_view(), name='characters-from-pdf'),
]
