# urls.py
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    # Chapter URLs
    path('chapters/', views.ChapterListCreateView.as_view(), name='chapter-list'),
    path('chapters/<str:pk>/', views.ChapterDetailView.as_view(), name='chapter-detail'),

    # Page URLs
    path('pages/', views.PageListCreateView.as_view(), name='page-list'),
    path('pages/<str:pk>/', views.PageDetailView.as_view(), name='page-detail'),
    path('reorder/pages/', views.ReorderPagesView.as_view(), name='reorder-scenes'),
]

# Add format suffix patterns to support format suffixes in URLs (e.g., .json)
urlpatterns = format_suffix_patterns(urlpatterns)
