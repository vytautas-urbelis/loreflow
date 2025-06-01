from django.urls import path

from .views import UserViewSet, UserMeView, UserCreateViewSet

# router = DefaultRouter()
# router.register(r'user', UserViewSet, basename='user')
# router.register(r'me', UserMeView, basename='user-me')
#
# urlpatterns = [
#     path('', include(router.urls)),
# ]


urlpatterns = [
    path('user/me', UserMeView.as_view(), name='user-me'),
    path('user/<str:pk>/', UserViewSet.as_view(), name='user-rud'),
    path('user/', UserCreateViewSet.as_view(), name='user-create'),
]
