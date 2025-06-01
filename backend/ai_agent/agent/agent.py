import json

from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction
from rest_framework.exceptions import ValidationError

from ai_agent.clients.openrouter_client import OpenRouterClient
from ai_agent.config.settings import OPEN_ROUTER_MODEL
from ai_agent.json_schemes.character_response_scheme import (
    character_response_scheme)
from ai_agent.json_schemes.item_response_scheme import (
    item_response_scheme)
from ai_agent.json_schemes.location_response_scheme import (
    location_response_scheme)
from ai_agent.json_schemes.plan_response_scheme import (
    plan_response_scheme)
from ai_agent.json_schemes.scene_response_scheme import (
    scene_response_scheme)
from ai_agent.prompts.system_prompt import system_prompt
from ai_agent.response_formats.scene_response_format import scene_response_format
from base.sender import Messenger
from process.models import Process
from process.serializers import ProcessSerializer
from project.models import Project
from project_chapters.models import Chapter
from project_chapters.serializers import ChapterSerializer
from project_characters.serializers import CharacterSerializer
from project_items.serializers import ItemSerializer
from project_locations.serializers import LocationSerializer
from project_scenes.models import Scene
from project_scenes.serializers import SceneSerializer


class AIAgent:
    def __init__(self, request_id, project,
                 api_key, channel, model=OPEN_ROUTER_MODEL):
        self.project = project
        # self.system_prompt = PromptSerializer(
        #     Prompt.objects.get(name='system_prompt')).data
        self.system_prompt = system_prompt
        self.api_key = api_key
        self.model = model
        self.context = {
            'existing_characters': project['characters'],
            'existing_locations': project['locations'],
            'existing_items': project['items'],
            'project_content': project['chapters'],
        }
        self.messenger = Messenger(channel)
        self.messages = project.get('chat_messages', None)
        self.request_id = request_id
        self.chapter = None
        # self.page = None
        self.scene = None

    def analyze_user_request(self, user_prompt, prompt_context, process):
        """Analyze user request."""
        # If context were provided, setting to local variables
        self.chapter = prompt_context['chapter']
        # self.page = prompt_context['page']
        self.scene = prompt_context['scene']

        process = Process.objects.get(id=process['id'])
        self.messenger.send_process_to_chat(
            ProcessSerializer(process).data, self.request_id)

        # building system prompt
        system_prompt = f"""
        {self.system_prompt}
        Existing project state: {self.context}
        """

        generated_user_prompt = f""""
        {user_prompt}
        {f'I am specifically talking about this chapter: {prompt_context['chapter']}'
            if prompt_context['chapter'] else ''},
            
        {f'specifically about this scene: {prompt_context['scene']}'
            if prompt_context['scene'] else ''},
            
        {f'specifically about this part of text: {prompt_context['selected_context_text']}'
            if prompt_context['selected_context_text'] else ''}
        """

        # If chat history exists
        if prompt_context['context_project']:
            # Adding first messages to chat
            self.messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": generated_user_prompt},
            ]
        else:
            # building system prompt
            system_prompt = f"""
            {self.system_prompt}
            """

            # Adding first messages to chat
            self.messages.append({"role": "assistant", "content": system_prompt})
            self.messages.append({"role": "user", "content": generated_user_prompt})

        try:
            # Calling ai api
            response = self._call_ai_api(ProcessSerializer(process).data, plan_response_scheme)

            # Adding generated plan to the chat
            self.messages.append({"role": "assistant", "content": json.dumps(response['content'])})
            return response

            # Calling generate plan methode to generate plan
        except Exception as e:
            print(e)
            process.status = "failed"
            process.save()
            self.messenger.send_process_to_chat(ProcessSerializer(process).data, self.request_id)

    def execute_plan(self, plan, process, model):
        """Execute generated plan with error handling"""

        # Retrieve process nad project
        project = Project.objects.get(id=self.project['id'])
        process = Process.objects.get(id=process['id'])

        try:
            for step in plan['plan_steps']:

                # finish the process ir it is the last step
                if process.status != 'in_progress':
                    if process.status != 'canceled':
                        process.status = "succeeded"
                        process.save()
                    self.update_chat_history()
                    self.messenger.send_process_to_chat(ProcessSerializer(process).data,
                                                        self.request_id)
                    return

                # Create subprocess for every single operation
                if (step['operation'] != 'write_response_summary' and
                        step['operation'] != 'answer_the_question' and
                        step['operation'] != 'ask_the_question'):
                    new_process = Process.objects.create(project=project, main_process=process)
                    new_process.description = step.get('description', [])
                    new_process.model_name = model
                    new_process.save()
                    # Send subprocess data to frontend
                    self.messenger.send_process_to_chat(ProcessSerializer(process).data,
                                                        self.request_id)
                else:
                    new_process = None

                # Loop steps and call functions according
                try:
                    if step['operation'] == 'create_character':
                        result = self.create_character(ProcessSerializer(new_process).data, step)
                    elif step['operation'] == 'create_location':
                        result = self.create_location(ProcessSerializer(new_process).data, step)
                    elif step['operation'] == 'create_item':
                        result = self.create_item(ProcessSerializer(new_process).data, step)
                    elif step['operation'] == 'write_response_summary':
                        # create new process changing process type to stream text
                        summary_process = Process.objects.create(project=project,
                                                                 type="stream_message")
                        result = self.write_response_summary(
                            ProcessSerializer(summary_process).data, step)
                    elif step['operation'] == 'answer_the_question':
                        # create new process changing process type to stream text
                        answer_process = Process.objects.create(project=project,
                                                                type="answer_the_question")
                        result = self.answer_the_question(ProcessSerializer(answer_process).data,
                                                          step)
                    elif step['operation'] == 'ask_the_question':
                        # create new process changing process type to stream text
                        ask_process = Process.objects.create(project=project,
                                                             type="ask_the_question")
                        result = self.ask_the_question(ProcessSerializer(ask_process).data, step)
                    elif step['operation'] == 'create_scene':
                        # create new process changing process type to stream text
                        scene_process = Process.objects.create(project=project,
                                                               type="create_scene")
                        result = self.create_scene(ProcessSerializer(scene_process).data, step)
                    elif step['operation'] == 'write_to_existing_scene':
                        # create new process changing process type to stream text
                        scene_process = Process.objects.create(project=project,
                                                               type="write_to_existing_scene")
                        result = self.write_to_existing_scene(
                            ProcessSerializer(scene_process).data, step)

                    # Else add result
                    self.messages.append({"role": 'assistant',
                                          "content": json.dumps(result, cls=DjangoJSONEncoder)})

                    # Save subprocess data
                    if new_process is not None:
                        new_process.status = 'succeeded'
                        new_process.save()

                    # Send subprocess to frontend
                    self.messenger.send_process_to_chat(ProcessSerializer(process).data,
                                                        self.request_id)

                except Exception as e:
                    new_process.status = 'failed'
                    new_process.save()
                    self.messenger.send_process_to_chat(ProcessSerializer(process).data,
                                                        self.request_id)
                    print(e)
                    # self._handle_error(step, e)

            process.status = "succeeded"
            process.save()
            self.update_chat_history()
            self.messenger.send_process_to_chat(ProcessSerializer(process).data, self.request_id)
            return True
        except Exception as e:
            print(e)
            process.status = "failed"
            process.save()
            self.messenger.send_process_to_chat(ProcessSerializer(process).data, self.request_id)

    def create_character(self, process, step):
        """Generate characters with depth and narrative potential"""
        # Building user prompt for character generation
        prompt = f"""
        You are executing the plan – Step {step['step_number']}.
        Create a character based on the following parameters: {step['parameters']}.
        Be highly creative and detailed.
        Ensure all details are fully specified—do not leave any fields incomplete or vague.
        """

        # Adding message to chat
        self.messages.append({"role": "user", "content": prompt})

        # Calling api to generate character
        data = self._call_ai_api(process, character_response_scheme)
        print("7: ", data['content'])

        try:
            character = data['content']['character']
            # Extract project instance
            project = Project.objects.get(id=self.project['id'])

            # Handle image
            character['image'] = None
            character['project'] = project.id

            # Use serializer for validation and creation
            with transaction.atomic():
                serializer = CharacterSerializer(data=character)
                if serializer.is_valid(raise_exception=True):
                    new_character = serializer.save()

                    # Send created location to frontend
                    self.messenger.send_created_character(CharacterSerializer(new_character).data,
                                                          self.project['id'])
                    return CharacterSerializer(new_character).data

        except Project.DoesNotExist:
            raise ValidationError(f"Project with ID {project.id} does not exist.")
        except Exception as e:
            # raise ValidationError(f"Failed to save location: {e}")
            print(f"Failed to save location: {e}")
            return {"result": f"step {step} failed", "error": str(e)}

    def create_location(self, process, step):
        """Generate location"""
        # Building user prompt for character generation
        prompt = f"""
        You are executing the plan – Step {step['step_number']}.
        Create a location based on the following parameters: {step['parameters']}.
        Be highly creative and detailed.
        Ensure all details are fully specified—do not leave any fields incomplete or vague.
        """

        # Adding message to chat
        self.messages.append({"role": "user", "content": prompt})

        # Calling api to generate character
        data = self._call_ai_api(process, location_response_scheme)
        print("7: ", data['content'])

        try:
            location = data['content']['location']
            # Extract project instance
            project = Project.objects.get(id=self.project['id'])

            # Handle image
            location['image'] = None
            location['project'] = project.id

            # Use serializer for validation and creation
            with transaction.atomic():
                serializer = LocationSerializer(data=location)
                if serializer.is_valid(raise_exception=True):
                    new_location = serializer.save()

                    # Send created location to frontend
                    self.messenger.send_created_location(LocationSerializer(new_location).data,
                                                         self.project['id'])
                    return LocationSerializer(new_location).data

        except Project.DoesNotExist:
            raise ValidationError(f"Project with ID {project.id} does not exist.")
        except Exception as e:
            # raise ValidationError(f"Failed to save location: {e}")
            print(f"Failed to save location: {e}")
            return {"result": f"step {step} failed", "error": str(e)}

    def create_item(self, process, step):
        """Generate Item"""
        # Building user prompt for character generation
        prompt = f"""
        You are executing the plan – Step {step['step_number']}.
        Create an item based on the following parameters: {step['parameters']}.
        Be highly creative and detailed.
        Ensure all details are fully specified—do not leave any fields incomplete or vague.
        """

        # Adding message to chat
        self.messages.append({"role": "user", "content": prompt})

        # Calling api to generate character
        data = self._call_ai_api(process, item_response_scheme)

        try:
            item = data['content']['item']
            # Extract project instance
            project = Project.objects.get(id=self.project['id'])

            # Handle image
            item['image'] = None
            item['project'] = project.id

            # Use serializer for validation and creation
            with transaction.atomic():
                serializer = ItemSerializer(data=item)
                if serializer.is_valid(raise_exception=True):
                    new_item = serializer.save()

                    # Send created item to frontend
                    self.messenger.send_created_item(ItemSerializer(new_item).data,
                                                     self.project['id'])
                    return ItemSerializer(new_item).data

        except Project.DoesNotExist:
            raise ValidationError(f"Project with ID {project.id} does not exist.")
        except Exception as e:
            # raise ValidationError(f"Failed to save location: {e}")
            print(f"Failed to save location: {e}")
            return {"result": f"step {step} failed", "error": str(e)}

    def create_scene(self, process, step):
        # scene_response_format = PromptSerializer(
        #     Prompt.objects.get(name='scene_response_format')).data
        """Create scene"""
        prompt = f"""
        You are executing the plan – Step {step['step_number']}.
        Create a scene based on the following parameters: {step['parameters']}.
        Be highly creative and descriptive.
        Only the "content" field may be left as an empty string; all other fields must be
        fully specified.
        """

        # Adding message to chat
        self.messages.append({"role": "user", "content": prompt})

        # Calling api to generate scene
        data = self._call_ai_api(process, scene_response_scheme)

        # If no chapter or scene were provided, retrieving last page and last scene created
        if not self.chapter:
            last_chapter = Chapter.objects.filter(project__id=self.project['id']).order_by(
                '-created_at').first()
            self.chapter = ChapterSerializer(last_chapter).data

        if not self.scene:
            last_scene = Scene.objects.filter(chapter__id=self.chapter['id']).order_by(
                '-sequence').first()
            if last_scene:
                self.scene = SceneSerializer(last_scene).data

        try:
            scene = data['content']['scene']
            scene['content'] = ''
            scene['project'] = self.project['id']
            scene['chapter'] = self.chapter['id']
            scene['sequence'] = (self.scene['sequence'] + 1) if self.scene else 1
            with transaction.atomic():
                serializer = SceneSerializer(data=scene)
                if serializer.is_valid(raise_exception=True):
                    new_scene = serializer.save()
                    # Send created item to frontend
                    self.messenger.send_created_scene(SceneSerializer(new_scene).data,
                                                      self.project['id'])

            self.messages.append(
                {"role": "assistant",
                 "content": json.dumps(SceneSerializer(new_scene).data, cls=DjangoJSONEncoder)})

            prompt = f"""
            You are executing the plan – Step {step['step_number']}.
            You have just created the scene as requested by the user. Now, based on the
            details provided:
            {step['parameters']['details']},
            write the scene content using the following text formatting style:
            {scene_response_format}

            IMPORTANT: Output only the scene content as plain text.
            Do NOT generate any JSON or HTML objects.

            This step will automatically update the "content" field in the scene instance.
            """

            # Adding message to chat
            self.messages.append({"role": "user", "content": prompt})

            # Calling api to generate character
            scene_content = self._call_ai_api_stream(process, SceneSerializer(new_scene).data)

            print("saving scene content")
            new_scene.content = scene_content
            new_scene.save()
            print("Scene content saved")
            self.scene = SceneSerializer(new_scene).data

            return SceneSerializer(new_scene).data
        except Exception as e:
            # raise ValidationError(f"Failed to save location: {e}")
            print(f"Failed to save location: {e}")
            return {"result": f"step {step} failed", "error": str(e)}

            # self.messages.append({"role": "assistant", "content": scene_content})

    def write_to_existing_scene(self, process, step):
        # scene_response_format = ResponseFormatSerializer(
        #     ResponseFormat.objects.get(name='scene_response_format')).data
        """Write scene"""
        try:
            scene = Scene.objects.get(id=self.scene['id'])

            prompt = f""" You are executing the plan – Step {step['step_number']}.
            The user has requested modifications to the scene content. Based on the
            following details: {step['parameters']['details']},
            and the user's instructions,
            rewrite the scene content or the specified part of the text.
            IMPORTANT:
            – Output only the scene content as plain text.
            – Do NOT generate any JSON or HTML objects.
            – If the user requested a rewrite of a specific part, modify only that part.
            Use the following formatting style:
            {scene_response_format}

            This step will automatically update the "content" field in the scene instance.
            """

            # Adding message to chat
            self.messages.append({"role": "user", "content": prompt})

            # Calling api to generate character
            scene_content = self._call_ai_api_stream(process, SceneSerializer(scene).data)

            print("saving scene content")
            scene.updated_content = scene_content
            scene.save()

            return SceneSerializer(scene).data
        except Exception as e:
            # raise ValidationError(f"Failed to save location: {e}")
            print(f"Failed to save location: {e}")
            return {"result": f"step {step} failed", "error": str(e)}

    def write_response_summary(self, process, step):
        """Write response summary"""
        # Building user prompt for summary
        prompt = f"""
        You are executing the plan – Step {step['step_number']}.
        Write a brief summary of what you have accomplished so far.
        Please format it as plain text.
        """

        # Adding message to chat
        self.messages.append({"role": "user", "content": prompt})

        # Calling api to generate character
        return self._call_ai_api_stream_to_chat(process)

    def answer_the_question(self, process, step):
        """Write response summary"""
        # Building user prompt for summary
        prompt = f"""
        You are executing the plan - Step {step['step_number']}.
        Write direct detailed answer to user question. Format plain text
        """

        # Adding message to chat
        self.messages.append({"role": "user", "content": prompt})

        # Calling api to generate character
        return self._call_ai_api_stream_to_chat(process)

    def ask_the_question(self, process, step):
        """Write response summary"""
        # Building user prompt for summary
        prompt = f"""
        You are executing the plan – Step {step['step_number']}.
        Provide a direct and detailed answer to the user's question.
        Please format your response as plain text.
        """

        # Adding message to chat
        self.messages.append({"role": "user", "content": prompt})

        # Calling api to generate character
        return self._call_ai_api_stream_to_chat(process)

    def update_chat_history(self):
        project = Project.objects.get(id=self.project['id'])
        project.chat_messages = self.messages
        project.save()

    def _call_ai_api_with_text_format(self, process):
        # defining OpenRouter client
        client = OpenRouterClient(api_key=self.api_key, model=self.model)

        # data is combined from "usage" and "content"
        data = client.stream_text(self.messages, client, self.messenger, self.request_id,
                                  process['id'])

        return data

    def _call_ai_api(self, process, response_format):
        # defining OpenRouter client
        client = OpenRouterClient(api_key=self.api_key, model=self.model)

        # data is combined from "usage" and "content"
        data = client.stream_structured(self.messages,
                                        response_format,
                                        self.messenger,
                                        self.request_id,
                                        process['id'])

        return data

    def _call_ai_api_stream_to_chat(self, process):
        # defining OpenRouter client
        client = OpenRouterClient(api_key=self.api_key, model=self.model)

        # data is combined from "usage" and "content"
        data = client.stream_text_to_chat(self.messages, self.messenger, self.request_id, process)

        return data

    def _call_ai_api_stream(self, process, instance):
        # defining OpenRouter client
        client = OpenRouterClient(api_key=self.api_key, model=self.model)

        # data is combined from "usage" and "content"
        if process['type'] == 'create_scene' or process['type'] == 'write_scene':
            data = client.stream_scene(self.messages, self.messenger, self.request_id, process,
                                       instance)
        if process['type'] == 'write_to_existing_scene':
            data = client.stream_to_existing_scene(self.messages,
                                                   self.messenger,
                                                   self.request_id,
                                                   process, instance)

        return data
