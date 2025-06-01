from celery import shared_task
from celery.utils.log import get_task_logger

from ai_agent.agent.agent import AIAgent
from process.models import Process

logger = get_task_logger(__name__)


@shared_task
def generate_response(user, project, user_prompt, process, request_id, prompt_context):
    # Create AI Agent instance
    ai_agent = AIAgent(request_id, project, user['open_router_api_key'], user['ws_chanel_code'],
                       user['selected_model'], )

    # Create plan based on user prompt
    # plan = ai_agent.generate_plan(user_prompt, process)
    plan = ai_agent.analyze_user_request(user_prompt, prompt_context, process)
    # plan = ai_agent.generate_plan(user_prompt, process)

    # Execute generated plan
    ai_agent.execute_plan(plan['content'], process, user['selected_model'])

    # Update proces status
    updatedProcess = Process.objects.get(id=process['id'])
    updatedProcess.status = 'completed'
    updatedProcess.save()

    return plan
