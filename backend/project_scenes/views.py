from rest_framework import generics, permissions, status
from rest_framework.response import Response

from filmai.permissions import IsProjectAuthor, IsPagesAuthor, IsChaptersAuthor
from .models import Scene
from .serializers import SceneSerializer


class SceneListCreateView(generics.ListCreateAPIView):
    # queryset = Scene.objects.all()
    serializer_class = SceneSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectAuthor]

    def get_queryset(self):
        queryset = Scene.objects.all()
        print(self.request.data)
        project_id = self.request.query_params.get('project_id', None)
        if project_id is not None:
            queryset = queryset.filter(project__id=project_id)
        return queryset

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SceneRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SceneSerializer
    permission_classes = [permissions.IsAuthenticated, IsChaptersAuthor]
    queryset = Scene.objects.all()


class ReorderScenesView(generics.ListCreateAPIView):
    serializer_class = SceneSerializer
    permission_classes = [permissions.IsAuthenticated, IsPagesAuthor]
    queryset = Scene.objects.all()

    def post(self, request, *args, **kwargs):
        new_order = request.data.get('order', None)

        if new_order is not None:
            for item in new_order:
                scene = Scene.objects.get(id=item['id'])
                scene.sequence = item['sequence']
                scene.save()

            return Response({'success': True}, status=status.HTTP_200_OK)
        return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)
