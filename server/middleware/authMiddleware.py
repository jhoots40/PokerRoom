from functools import wraps
from django.http import HttpResponseForbidden
import logging

logger = logging.getLogger("django")

def custom_auth_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        # Check if the user is authenticated
        logger.info(f"Checking if user is authenticated: {request.user}")
        if not request.user.is_authenticated:
            # If not authenticated, return a 403 Forbidden response
            return HttpResponseForbidden("You are not authorized to access this resource.")
        
        # If authenticated, call the original view function
        return view_func(request, *args, **kwargs)
    
    return wrapper