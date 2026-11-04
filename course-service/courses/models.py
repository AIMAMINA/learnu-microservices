from django.db import models

class Course(models.Model):
   
    name = models.CharField(max_length=200)
    instructor = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    schedule = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.id} - {self.name}"


class StudentCourse(models.Model):

    student_id = models.IntegerField()


    course_id = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,      
        db_column='course_id'         )
        

    def __str__(self):
        return f"Student {self.student_id} -> Course {self.course_id.id}"
