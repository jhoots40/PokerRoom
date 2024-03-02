from django.shortcuts import render, HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import logging, json
from django.http import JsonResponse
from core.models import CustomUser
from utils.db_connection import MongoDBConnection
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect
from middleware.authMiddleware import custom_auth_required
from django.contrib.auth.hashers import make_password

# Create an instance of MongoDBConnection
mongo_connection = MongoDBConnection()

logger = logging.getLogger("django")

@csrf_exempt
@require_http_methods(["POST"])
def userLogin(request):
    if request.method == "POST":
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            # Now you can use username and password as needed
            logger.info(f"Received login request for username: {username}")

            # Authenticate the user
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                # Authentication successful
                logger.info("User is authenticated")
                logger.info(f"Authenticated user: {user}")
                
                # Log user's username and password (for debugging purposes only)
                logger.info(f"User username: {user.username}")
                logger.info(f"User password: {user.password}")
                
                # Login the user
                login(request, user)
                
                return JsonResponse({'message': 'Login successful'}) # Return success response
            else:
                # Authentication failed
                logger.info("Invalid credentials")
                return JsonResponse({'error': 'Invalid credentials'}, status=401)  # Return unauthorized error
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)  # Report JSON decoding error
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            return JsonResponse({'error': str(e)}, status=500)  # Report other unexpected errors
    else:
        return HttpResponse("Invalid request method", status=405)  # Return method not allowed for non-POST requests

@csrf_exempt
@require_http_methods(["POST"])
def userRegister(request):
    if request.method == "POST":
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            # Hash the password
            hashed_password = make_password(password)

            # Now you can use username, email, and password as needed
            logger.info(f"Received registration request for username: {username}")
            # Perform registration logic here

            # Create a new user instance
            newUser = CustomUser(username=username, email=email, password=hashed_password, balance=1000.00)
            newUser.save()

             # Authenticate the newly registered user
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # Login the user
                login(request, user)
                return JsonResponse({'message': 'Registration and login successful'})  # Return success response
            else:
                return JsonResponse({'error': 'Authentication failed'}, status=401)  # Return authentication error
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)  # Report JSON decoding error
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)  # Report other unexpected errors
    else:
        return HttpResponse("Invalid request method", status=405)  # Return method not allowed for non-POST requests
    
@csrf_exempt    
@custom_auth_required
def userInfo(request):
    user = request.user
    # Now 'user' contains the authenticated user object
    logger.info(f"Received request for user information for user: {user.username}")
    
    # Extract relevant user information
    user_info = {
        'username': user.username,
        # Add other user attributes as needed
    }
    
    return JsonResponse(user_info)
