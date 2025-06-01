import os

from rest_framework import status
from rest_framework.generics import RetrieveUpdateDestroyAPIView, CreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from filmai.permissions import IsProjectAuthor
from .models import Character
from .serializers import CharacterSerializer

"""API views for PDF processing and character extraction."""
from ai_agent.services.character_service import extract_characters
from ai_agent.services.pdf_service import process_pdf_in_chunks
from ai_agent.clients.mistral_client import MistralClient
from ai_agent.clients.deepseek_client import OpenAIClient
from project.models import Project, Book


class CharacterViewSet(RetrieveUpdateDestroyAPIView):
    serializer_class = CharacterSerializer
    permission_classes = (IsAuthenticated, IsProjectAuthor)

    def get_queryset(self):
        return Character.objects.filter(project__created_by=self.request.user)


class CreateExtractedCharacterViewSet(CreateAPIView):
    get_queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CreateNewCharacterViewSet(CreateAPIView):
    get_queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = (IsAuthenticated, IsProjectAuthor)

    def post(self, request, *args, **kwargs):
        project_id = self.request.data.get('project', None)
        print(request.data)
        try:
            Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            return Response({"error": "MovieProject not found."},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        # Save with project context
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DeleteImageView(DestroyAPIView):
    serializer_class = CharacterSerializer
    permission_classes = (IsAuthenticated, IsProjectAuthor)

    def delete(self, request, *args, **kwargs):
        id = self.kwargs['pk']
        character = Character.objects.get(pk=id)
        if character.image:
            # Get the file path
            image_path = character.image.path

            # Delete the file if it exists
            if os.path.isfile(image_path):
                os.remove(image_path)

            # Set the image field to None
            character.image = None
            character.save()

            return Response({"status": "success", "message": "Image deleted successfully"},
                            status=status.HTTP_200_OK)
        else:
            return Response({"status": "fail", "message": "No image to delete"},
                            status=status.HTTP_200_OK)


# class GenerateCharacter(CreateAPIView):
#     serializer_class = CharacterSerializer
#     permission_classes = (IsAuthenticated, IsProjectAuthor)
#
#     def post(self, request, *args, **kwargs):
#         # Assign data from request
#         user_prompt = request.data.get('user_prompt', None)
#         project_id = self.request.data.get('project_id', None)
#
#         # Select AI model based on request
#         model_type = request.data.get('model_type', None)
#         model_name = request.data.get('model_name', None)
#         stream = request.data.get('stream', None)
#
#         # Get the project
#         project = Project.objects.get(pk=project_id)
#
#         # Get current project characters
#         current_characters = Character.objects.filter(project__created_by=self.request.user)
#
#         # Current project current chapters in content
#         content = project.content
#
#         # Combine data
#         project_data = {"book_content": content, "current_characters": current_characters}
#
#         # Generate system prompt
#         system_prompt = generate_character_generate_system_prompt(user_prompt, project_data)


class CharactersFromPdfView(APIView):
    """API view for extracting characters from PDF files."""

    # parser_classes = [MultiPartParser, FormParser]
    # permission_classes = [isAuthenticated]

    def post(self, request, *args, **kwargs):
        """Handle POST requests with PDF uploads."""

        try:
            # Get the movie project
            user = request.user
            ws_chanel = user.ws_chanel_code
            project_id = request.data['project_id']
            project = Project.objects.get(id=project_id)
            book = Book.objects.filter(project=project).first()
            print(book)

            # Select AI model based on request
            model_type = request.data.get('model_type', 'mistral')
            model_name = request.data.get('model_name')

            # Initialize appropriate client
            if model_type == 'openai':
                client = OpenAIClient(model=model_name)
            else:
                client = MistralClient(model=model_name)

            # Process function for each PDF chunk
            def process_chunk(text, **kwargs):
                return extract_characters(
                    text=text,
                    channel=ws_chanel,
                    existing_characters=kwargs.get('existing_result', {}),
                    movie_project_id=project_id,
                    client=client
                )

            # Process the PDF
            characters_json = process_pdf_in_chunks(
                book.file,
                process_chunk,
                initial_result={}
            )

            return Response({'characters': characters_json}, status=status.HTTP_200_OK)

        except Project.DoesNotExist:
            return Response(
                {'error': f'Movie project with id {project_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            error_message = f"Error processing PDF: {str(e)}"
            print(error_message)
            return Response(
                {'error': error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
