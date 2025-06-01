# urls.py
from django.urls import path

from .views import EmptyChatPrompt, StopProcess

urlpatterns = [
    # path('chat/', ChatViewSet.as_view(), name='chat-stream'),
    path('prompts/em-prompt/', EmptyChatPrompt.as_view(), name='empty-chat-prompt'),
    path('prompts/stop/', StopProcess.as_view(), name='empty-chat-prompt'),

]
