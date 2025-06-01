from django.urls import path

from .views import SceneListCreateView, SceneRetrieveUpdateDestroyView, ReorderScenesView

urlpatterns = [
    path('scenes/', SceneListCreateView.as_view(), name='scene-list-create'),
    path('scenes/new/', SceneListCreateView.as_view(), name='scene-list-create'),
    path('reorder/scenes/', ReorderScenesView.as_view(), name='reorder-scenes'),
    path('scenes/<str:pk>/', SceneRetrieveUpdateDestroyView.as_view(), name='scene-detail'),
]
