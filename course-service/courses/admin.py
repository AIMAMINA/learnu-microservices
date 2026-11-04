from django.contrib import admin
from .models import Course, StudentCourse

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'instructor', 'category', 'schedule')
    search_fields = ('name', 'instructor', 'category')

@admin.register(StudentCourse)
class StudentCourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'student_id', 'course_id')
    search_fields = ('student_id', 'course_id__name')
