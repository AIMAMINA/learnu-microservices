from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Course, StudentCourse
from .serializers import CourseSerializer, StudentCourseSerializer

# Vue pour les cours
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'instructor', 'category']


# Vue pour les inscriptions des étudiants
class StudentCourseViewSet(viewsets.ModelViewSet):
    queryset = StudentCourse.objects.all()
    serializer_class = StudentCourseSerializer
    # ?course_id=3 or ?student_id=7 (used by the GraphQL gateway)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["course_id", "student_id"]
