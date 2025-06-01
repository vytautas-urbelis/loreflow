# views.py

from rest_framework import generics, status, permissions
from rest_framework.response import Response

from filmai.permissions import IsProjectAuthor, IsChaptersAuthor
from project.models import Project
from .models import Chapter, Page
from .serializers import ChapterSerializer, PageSerializer


# Chapter views
class ChapterListCreateView(generics.ListCreateAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer

    def get_queryset(self):
        """Optionally filter by project"""
        queryset = Chapter.objects.all()
        project_id = self.request.query_params.get('project_id', None)
        if project_id is not None:
            queryset = queryset.filter(project=project_id)
        return queryset

    def create(self, request, *args, **kwargs):
        # Assigning data from request
        project_id = request.data['project']

        # Fetching specific project
        project = Project.objects.get(pk=project_id)

        # creating serializer
        serializer = self.get_serializer(data=request.data)

        # Checking if data is valid
        serializer.is_valid(raise_exception=True)

        # Creating chapter
        chapter = serializer.save(project=project, )

        # Create new empty page for chapter
        Page.objects.create(text='', sequence=1, chapter=chapter)

        # # Creating Narrator Character for first chapter
        # character = Character.objects.create(project=project, name='Narrator')

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsProjectAuthor)


# Page views
class PageListCreateView(generics.ListCreateAPIView):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsChaptersAuthor)

    def get_queryset(self):
        """Optionally filter by chapter"""
        queryset = Page.objects.all()
        chapter_id = self.request.query_params.get('chapter', None)
        if chapter_id is not None:
            queryset = queryset.filter(chapter=chapter_id)
        return queryset


class PageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsChaptersAuthor)


class ReorderPagesView(generics.ListCreateAPIView):
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated, IsChaptersAuthor]
    queryset = Page.objects.all()

    def post(self, request, *args, **kwargs):
        new_order = request.data.get('order', None)

        if new_order is not None:
            for item in new_order:
                page = Page.objects.get(id=item['id'])
                page.sequence = item['sequence']
                page.save()

            return Response({'success': True}, status=status.HTTP_200_OK)
        return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)

# TextUnit views
# class TextUnitListCreateView(generics.ListCreateAPIView):
#     queryset = TextUnit.objects.all()
#     serializer_class = TextUnitSerializer
#
#     def get_queryset(self):
#         """Optionally filter by page"""
#         queryset = TextUnit.objects.all()
#         page_id = self.request.query_params.get('page', None)
#         if page_id is not None:
#             queryset = queryset.filter(page=page_id)
#         return queryset
#
#
# class TextUnitDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = TextUnit.objects.all()
#     serializer_class = TextUnitSerializer
