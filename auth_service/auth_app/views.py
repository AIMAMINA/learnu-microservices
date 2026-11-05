from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import logging

from .models import UserSettings

logger = logging.getLogger(__name__)


def password_errors(password, user=None):
    """Django's password rules (length, common passwords, only digits...)."""
    try:
        validate_password(password, user)
        return None
    except ValidationError as e:
        return " ".join(e.messages)


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

            error = password_errors(password, User(username=username, email=email))
            if error:
                return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

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

        except Exception:
            logger.exception("Unexpected error")
            return Response({"error": "Server error, please try again."},
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

        except Exception:
            logger.exception("Unexpected error")
            return Response({"error": "Server error, please try again."},
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
    prefs, _ = UserSettings.objects.get_or_create(user=request.user)
    if request.method == 'PUT':
        for field in ("dark_mode", "notifications"):
            if field in request.data:
                prefs.__setattr__(field, bool(request.data[field]))
        prefs.save()
    return Response({"dark_mode": prefs.dark_mode, "notifications": prefs.notifications})


# -------------------------------------------------------------
# 🔹 CHANGE PASSWORD
# -------------------------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current = request.data.get("current_password", "")
    new = request.data.get("password", "")

    if not current or not new:
        return Response({"error": "Current and new passwords are required."},
                        status=status.HTTP_400_BAD_REQUEST)
    if not user.check_password(current):
        return Response({"error": "The current password is incorrect."},
                        status=status.HTTP_400_BAD_REQUEST)
    error = password_errors(new, user)
    if error:
        return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new)
    user.save()
    return Response({"message": "Password changed successfully."})
