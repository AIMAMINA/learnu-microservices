from rest_framework.test import APITestCase

from .models import Course


class EnrollmentTests(APITestCase):
    def setUp(self):
        self.python = Course.objects.create(name="Python", instructor="A", category="CS")
        self.java = Course.objects.create(name="Java", instructor="B", category="CS")

    def enroll(self, student, course):
        return self.client.post("/student-courses/", {"student_id": student, "course_id": course.id}, format="json")

    def test_cannot_enroll_twice_in_the_same_course(self):
        self.assertEqual(self.enroll(1, self.python).status_code, 201)
        self.assertEqual(self.enroll(1, self.python).status_code, 400)
        self.assertEqual(self.enroll(1, self.java).status_code, 201)

    def test_filter_enrollments_by_course(self):
        self.enroll(1, self.python)
        self.enroll(2, self.python)
        self.enroll(3, self.java)
        res = self.client.get(f"/student-courses/?course_id={self.python.id}")
        self.assertEqual(sorted(e["student_id"] for e in res.data), [1, 2])
