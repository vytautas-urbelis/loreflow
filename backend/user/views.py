from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.response import Response

from filmai.permissions import IsSelf
from .serializers import UserSerializer

User = get_user_model()


class UserCreateViewSet(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []


class UserViewSet(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSelf]


class UserMeView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSelf]

    def get(self, *args, **kwargs):
        serializer = UserSerializer(User.objects.get(id=self.request.user.id))
        return Response(serializer.data, status=status.HTTP_200_OK)
