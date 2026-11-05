import os
import strawberry
import requests
from typing import List, Optional

# Internal addresses of the services (set in docker-compose / .env)
COURSE_SERVICE_URL = os.environ.get("COURSE_SERVICE_URL", "http://localhost:8002").rstrip("/")
STUDENT_SERVICE_URL = os.environ.get("STUDENT_SERVICE_URL", "http://localhost:8080").rstrip("/")

REQUEST_TIMEOUT = 5 


@strawberry.type
class University:
    id: int
    name: str
    city: str
    studentsCount: int | None = None


@strawberry.type
class Student:
    id: int
    name: str
    address: str
    university: Optional[University] = None


@strawberry.type
class Course:
    id: int
    name: str
    instructor: str
    category: str
    schedule: Optional[str] = None


@strawberry.type
class CourseWithStudents:
    course: Course
    students: List[Student]


class ServiceUnavailable(Exception):
    """Shown to the client as a GraphQL error instead of a silent empty list."""


def _get_json(url: str):
    try:
        r = requests.get(url, timeout=REQUEST_TIMEOUT)
        r.raise_for_status()
        return r.json()
    except (requests.RequestException, ValueError) as exc:
        print(f"[GraphQL] GET {url} failed: {exc}")
        raise ServiceUnavailable(f"A backend service is unavailable ({url.split('/')[2]}).") from exc


def _to_student(data: dict) -> Student:
    uni = data.get("university")
    university = None
    if isinstance(uni, dict):
        university = University(**{k: v for k, v in uni.items() if k in {"id", "name", "city", "studentsCount"}})
    return Student(id=data["id"], name=data.get("name", ""), address=data.get("address", ""), university=university)


@strawberry.type
class Query:
    @strawberry.field
    def courses(self) -> List[Course]:
        return [Course(**c) for c in _get_json(f"{COURSE_SERVICE_URL}/courses/")]

    @strawberry.field
    def students(self) -> List[Student]:
        return [_to_student(s) for s in _get_json(f"{STUDENT_SERVICE_URL}/students/all")]

    @strawberry.field
    def course_with_students(self, id: int) -> Optional[CourseWithStudents]:
        try:
            course = Course(**_get_json(f"{COURSE_SERVICE_URL}/courses/{id}/"))
        except ServiceUnavailable:
            return None  # unknown course id

        enrollments = _get_json(f"{COURSE_SERVICE_URL}/student-courses/?course_id={id}")
        enrolled_ids = {e["student_id"] for e in enrollments if e.get("student_id")}

        # One call for all students instead of one call per enrolled student
        students = [_to_student(s) for s in _get_json(f"{STUDENT_SERVICE_URL}/students/all")
                    if s.get("id") in enrolled_ids]
        return CourseWithStudents(course=course, students=students)


schema = strawberry.Schema(query=Query)
