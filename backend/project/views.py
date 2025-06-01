from django.core.files.uploadhandler import FileUploadHandler
from rest_framework import generics, permissions, status
from rest_framework.generics import DestroyAPIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from filmai.permissions import IsProjectAuthor
from .models import Project, Book
from .serializers import ProjectSerializer, BookSerializer
from .services.pdf_service import split_pdf_to_pages


class ProjectList(generics.ListCreateAPIView):
    """
    List all movie projects for the current user, or create a new movie project.
    """
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        # Return only projects owned by the current user
        return Project.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user to the project
        serializer.save(created_by=self.request.user)


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a movie project instance.
    """
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        # Return only projects owned by the current user
        return Project.objects.filter(created_by=self.request.user)


class AddBookView(generics.ListCreateAPIView):
    """
    List all movie projects for the current user, or create a new movie project.
    """
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser, FileUploadHandler]

    def get_queryset(self):
        # Return only projects owned by the current user
        return Book.objects.filter(project__created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        project_id = request.data.get('project_id', None)
        user = request.user

        # Get project
        project = Project.objects.get(pk=project_id, created_by=user)

        # Delete existing book if any
        book = Book.objects.filter(project=project).first()
        if book:
            book.delete()

        # Create serializer and validate
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the book
        book = serializer.save(project=project)

        # Split PDF into pages
        pages = split_pdf_to_pages(book.file)

        # Update book with pages and save
        book.pages = pages
        book.save()

        # Create a new serializer with the updated instance
        updated_serializer = self.get_serializer(book)

        return Response(updated_serializer.data, status=status.HTTP_201_CREATED)


class DeleteBookView(DestroyAPIView):
    """
    List all movie projects for the current user, or create a new movie project.
    """
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectAuthor]

    def get_queryset(self):
        # Return only projects owned by the current user
        return Book.objects.filter(project__created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        book = Book.objects.filter(id=pk).first()
        if book:
            book.delete()
            return Response({"message": "Book successfully deleted"}, status=status.HTTP_200_OK)
        return Response({"message": "No book to delete."}, status=status.HTTP_400_BAD_REQUEST)
