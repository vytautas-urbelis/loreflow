import uuid

from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from process.models import Process
from process.serializers import ProcessSerializer
from project.serializers import ProjectSerializer
from user.serializers import UserSerializer
from .tasks import generate_response

"""API views for PDF processing and character extraction."""
from project.models import Project
from filmai.celery import app


class EmptyChatPrompt(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    """API view for prompts when user not specify Chapter, Scene or Page."""

    def post(self, request, *args, **kwargs):
        # Generate request id
        request_id = uuid.uuid4()

        # Assign data from request
        user = request.user
        project_id = request.data.get('project_id')
        user_prompt = request.data.get('user_prompt')

        # Assign context variables
        chapter = None if request.data.get('chapter') == "null" else request.data.get('chapter',
                                                                                      None)
        # page = None if request.data.get('page') == "null" else request.data.get('page', None)
        scene = None if request.data.get('scene') == "null" else request.data.get('scene', None)
        selected_context_text = None if request.data.get(
            'selectedContextText') == "null" else request.data.get(
            'selectedContextText', None)
        context_project = None if request.data.get(
            'contextProject') == "null" else request.data.get('contextProject',
                                                              None)
        prompt_context = {'chapter': chapter, 'scene': scene,
                          'selected_context_text': selected_context_text,
                          'context_project': context_project}
        # print(prompt_context)

        # Description to describe process
        description = "Analyzing user request and creating a plan."

        # Serialize user instance
        serialized_user = UserSerializer(user).data

        # Get project instance
        project = Project.objects.get(pk=project_id)
        # Serialize project instance
        serialized_project = ProjectSerializer(project).data

        # Create process instance
        process = Process.objects.create(project=project, description=description)
        # Serialize process instance
        serialized_process = ProcessSerializer(process).data

        task = generate_response.delay(serialized_user,
                                       serialized_project,
                                       user_prompt,
                                       serialized_process,
                                       request_id,
                                       prompt_context)
        process.task_id = task.id
        process.save()

        serializer = ProcessSerializer(process)

        return Response({"process": serializer.data,
                         "task": task.id,
                         "request_id": request_id},
                        status=status.HTTP_200_OK)


class StopProcess(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    """API view for prompts when user not specify Chapter, Scene or Page."""

    def post(self, request, *args, **kwargs):
        # Assign data from request
        process_id = request.data.get('process_id')
        request_id = request.data.get('request_id')

        process = Process.objects.filter(id=process_id).first()
        app.control.revoke(process.task_id, terminate=True)

        if process is None:
            return Response({"message": "No process found."}, status=status.HTTP_404_NOT_FOUND)
        process.status = "canceled"
        process.save()

        process_serializer = ProcessSerializer(process)

        return Response({"process": process_serializer.data, "request_id": request_id})
