from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


def tokens_for(user):
    """JWT pair; the username claim is read by the API gateway for activity logs."""
    refresh = RefreshToken.for_user(user)
    refresh["username"] = user.username
    return refresh


# -------------------------------------------------------------
# 🔹 REGISTER (Create new user)
# -------------------------------------------------------------
class RegisterView(APIView):
    def post(self, request):
        try:
            data = request.data
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            # Vérification des champs
            if not username or not email or not password:
                return Response(
                    {"error": "All fields are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Normalisation
            email = email.strip().lower()
            username = username.strip()

            # Vérifie unicité
            if User.objects.filter(username__iexact=username).exists():
                return Response({"error": "Username already exists."},
                                status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(email__iexact=email).exists():
                return Response({"error": "Email already exists."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Crée l’utilisateur
            user = User.objects.create_user(username=username, email=email, password=password)

            # 🔐 Crée directement un token JWT (facultatif)
            refresh = tokens_for(user)

            return Response({
                "message": "User created successfully.",
                "user": {"username": user.username, "email": user.email},
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Server error: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# -------------------------------------------------------------
# 🔹 LOGIN (username OR email)
# -------------------------------------------------------------
class LoginView(APIView):
    def post(self, request):
        try:
            identifier = request.data.get("username")
            password = request.data.get("password")

            if not identifier or not password:
                return Response(
                    {"error": "Missing credentials."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            identifier = identifier.strip()

            # Find the account by email or by username, ignoring case
            # ("AMINA", "amina" and "Amina" all match the same account)
            field = "email__iexact" if "@" in identifier else "username__iexact"
            user_obj = User.objects.filter(**{field: identifier}).first()
            user = authenticate(username=user_obj.username, password=password) if user_obj else None

            if user is None:
                return Response({"error": "Invalid credentials."},
                                status=status.HTTP_401_UNAUTHORIZED)

            refresh = tokens_for(user)
            return Response({
                "message": "Login successful.",
                "username": user.username,
                "email": user.email,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Server error: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# -------------------------------------------------------------
# 🔹 USER PROFILE (Protected route)
# -------------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "role": getattr(user, "role", "User"),
    })


# -------------------------------------------------------------
# 🔹 USER SETTINGS
# -------------------------------------------------------------
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_settings(request):
    user = request.user
    if request.method == 'GET':
        return Response({
            "dark_mode": getattr(user, "dark_mode", False),
            "notifications": getattr(user, "notifications", True),
        })
    elif request.method == 'PUT':
        data = request.data
        user.dark_mode = data.get("dark_mode", False)
        user.notifications = data.get("notifications", True)
        user.save()
        return Response({"message": "Settings updated successfully."})


# -------------------------------------------------------------
# 🔹 CHANGE PASSWORD
# -------------------------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    password = request.data.get("password")

    if not password:
        return Response({"error": "Password required."},
                        status=status.HTTP_400_BAD_REQUEST)

    user.set_password(password)
    user.save()
    return Response({"message": "Password changed successfully."})
