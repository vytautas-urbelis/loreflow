from celery import shared_task


@shared_task
def example_task(param1, param2):
    print(f"Task completed with {param1} and {param2}")
    return f"Task completed with {param1} and {param2}"
