from django.http import HttpResponse

def home(request):
    return HttpResponse("GraphQL Gateway is running 🚀 — go to /graphql/")
