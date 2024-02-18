from django.shortcuts import render, HttpResponse

# Create your views here.
def login(request):
    # Handle your GET request logic here
    response = HttpResponse("Pinged login")
    return response
