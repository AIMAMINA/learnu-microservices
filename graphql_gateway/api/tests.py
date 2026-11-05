from unittest import mock

import requests
from django.test import TestCase

from .schema import schema

COURSES = [{"id": 1, "name": "Python", "instructor": "A", "category": "CS", "schedule": ""}]
STUDENTS = [
    {"id": 7, "name": "Amina", "address": "Constantine", "university": {"id": 1, "name": "UC2", "city": "Constantine"}},
    {"id": 8, "name": "Imene", "address": "Alger", "university": None},
]


def fake_get(url, timeout):
    data = {
        "/courses/": COURSES,
        "/courses/1/": COURSES[0],
        "/student-courses/?course_id=1": [{"student_id": 7, "course_id": 1}],
        "/students/all": STUDENTS,
    }
    for suffix, payload in data.items():
        if url.endswith(suffix):
            response = mock.Mock(status_code=200)
            response.json.return_value = payload
            response.raise_for_status.return_value = None
            return response
    raise requests.ConnectionError("down")


class SchemaTests(TestCase):
    @mock.patch("api.schema.requests.get", side_effect=fake_get)
    def test_course_with_students_returns_only_enrolled(self, get):
        result = schema.execute_sync("{ courseWithStudents(id: 1) { course { name } students { name } } }")
        self.assertIsNone(result.errors)
        self.assertEqual([s["name"] for s in result.data["courseWithStudents"]["students"]], ["Amina"])
        self.assertEqual(sum("/students/" in c.args[0] for c in get.call_args_list), 1)  # no N+1

    @mock.patch("api.schema.requests.get", side_effect=requests.ConnectionError("down"))
    def test_errors_are_reported_instead_of_an_empty_list(self, _get):
        result = schema.execute_sync("{ courses { name } }")
        self.assertIsNotNone(result.errors)
        self.assertIn("unavailable", result.errors[0].message)
