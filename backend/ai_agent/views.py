from typing import Generator

from django.http import StreamingHttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from project.models import Project, Book
from .clients.deepseek_client import OpenAIClient
from .clients.mistral_client import MistralClient
from .clients.openrouter_client import OpenRouterClient
from .config.settings import DEFAULT_CHANNEL
from .services.character_service import extract_characters
from .services.pdf_service import process_pdf_in_chunks
from .utils.websocket_utils import send_to_websocket, format_stream_message, format_done_message


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
            open_router_api_key = user.open_router_api_key
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
                # client = MistralClient(model=model_name)
                client = OpenRouterClient(api_key=open_router_api_key)

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


class ChatViewSet(APIView):
    """API view for handling chat interactions."""

    def post(self, request, *args, **kwargs):
        """Handle POST requests for chat."""
        prompt = request.data.get("message", "")
        model_type = request.data.get("model_type", "openai")
        model_name = request.data.get("model_name")

        # Create streaming response
        response = StreamingHttpResponse(
            self._generate_chat_stream(prompt, model_type, model_name),
            content_type='text/event-stream',
            headers={'Cache-Control': 'no-cache'}
        )

        # Set headers
        response['Cache-Control'] = 'no-cache, no-transform'
        response['X-Accel-Buffering'] = 'no'
        response['Connection'] = 'keep-alive'

        return response

    def _generate_chat_stream(self, prompt: str, model_type: str,
                              model_name: str = None) -> Generator:
        """Generate a stream of chat responses using selected model."""
        # Initialize appropriate client
        if model_type == 'mistral':
            client = MistralClient(model=model_name)
        else:
            client = OpenAIClient(model=model_name)

        try:
            # Get stream from client
            response_stream = client.stream(prompt)

            for chunk in response_stream:
                if hasattr(chunk, 'choices') and chunk.choices and chunk.choices[0].delta:
                    content = chunk.choices[0].delta.content
                    if content:
                        send_to_websocket(content, DEFAULT_CHANNEL)
                        yield format_stream_message(content)

                elif (hasattr(chunk, 'choices') and chunk.choices and
                      chunk.choices[0].finish_reason):
                    yield format_done_message()

        except Exception as e:
            error_message = f"Error generating chat: {str(e)}"
            print(error_message)
            yield format_stream_message(error_message)
            yield format_done_message()

# class ExtractChaptersFromPdfView(APIView):
#
#     def post(self, request, *args, **kwargs):
#         process_id = request.data.get('process_id', "None")
#
#         client = MistralClient()
