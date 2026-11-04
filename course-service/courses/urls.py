from rest_framework import routers
from .views import CourseViewSet, StudentCourseViewSet

router = routers.DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'student-courses', StudentCourseViewSet)

urlpatterns = router.urls
