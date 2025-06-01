import os

from rest_framework import generics, permissions, status
from rest_framework.generics import DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from filmai.permissions import IsProjectAuthor
from project.models import Project
from .models import Item
from .serializers import ItemSerializer


class ItemListCreateView(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsProjectAuthor]

    def post(self, request, *args, **kwargs):
        project_id = self.request.data.get('project', None)
        try:
            Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        # Save with project context
        serializer.save(project_id=project_id)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsProjectAuthor]


class DeleteImageView(DestroyAPIView):
    serializer_class = ItemSerializer
    permission_classes = (IsAuthenticated, IsProjectAuthor)

    def delete(self, request, *args, **kwargs):
        id = self.kwargs['pk']
        item = Item.objects.get(pk=id)
        if item.image:
            # Get the file path
            image_path = item.image.path

            # Delete the file if it exists
            if os.path.isfile(image_path):
                os.remove(image_path)

            # Set the image field to None
            item.image = None
            item.save()

            return Response({"status": "success", "message": "Image deleted successfully"},
                            status=status.HTTP_200_OK)
        else:
            return Response({"status": "fail", "message": "No image to delete"},
                            status=status.HTTP_200_OK)
