from django.urls import path

from .views import ProjectList, ProjectDetail, AddBookView, DeleteBookView

urlpatterns = [
    path('projects/', ProjectList.as_view(), name='project-list'),
    path('projects/<str:pk>/', ProjectDetail.as_view(), name='project-detail'),
    path('add-book/', AddBookView.as_view(), name='add-project-book'),
    path('delete-book/<str:pk>', DeleteBookView.as_view(), name='delete-book'),
]
