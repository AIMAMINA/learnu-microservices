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


def _safe_get_json(url: str):
    """Sécurise la récupération JSON avec timeout et validation du header."""
    try:
        r = requests.get(url, timeout=REQUEST_TIMEOUT)
        r.raise_for_status()
        if "application/json" not in (r.headers.get("Content-Type") or ""):
            raise ValueError(f"Non-JSON response from {url}")
        return r.json()
    except Exception as exc:
        print(f"[Gateway] GET {url} failed: {exc}")
        return None


@strawberry.type
class Query:
    # ) Tous les cours (Django 8082)
    @strawberry.field
    def courses(self) -> List[Course]:
        data = _safe_get_json(f"{COURSE_SERVICE_URL}/courses/")
        if not data:
            return []
        return [Course(**c) for c in data]

    # 2) Tous les étudiants (Spring 8084)
    @strawberry.field
    def students(self) -> List[Student]:
        data = _safe_get_json(f"{STUDENT_SERVICE_URL}/students/all")
        if not data:
            return []

        out: List[Student] = []
        for s in data:
            uni_data = s.pop("university", None)

            #filtrage des champs autorisés pour éviter les erreurs
            if isinstance(uni_data, dict):
                allowed = {
                    k: v
                    for k, v in uni_data.items()
                    if k in {"id", "name", "city", "studentsCount"}
                }
                university = University(**allowed)
            else:
                university = None

            out.append(Student(university=university, **s))
        return out

    # 3) Un cours + ses inscrits
    @strawberry.field
    def course_with_students(self, id: int) -> Optional[CourseWithStudents]:
        # 1️⃣ cours (Django)
        course_json = _safe_get_json(f"{COURSE_SERVICE_URL}/courses/{id}/")
        if not course_json:
            return None
        course = Course(**course_json)

        # 2️ inscriptions
        enrollments = _safe_get_json(f"{COURSE_SERVICE_URL}/student-courses/?course_id={id}") or []

        # 3️récupérer chaque étudiant (Spring Boot)
        students: List[Student] = []
        for e in enrollments:
            sid = e.get("student_id")
            if not sid:
                continue

            student_json = _safe_get_json(f"{STUDENT_SERVICE_URL}/students/{sid}")
            if not student_json:
                print(f"[Gateway] student {sid} not found")
                continue

            uni_data = student_json.pop("university", None)

            if isinstance(uni_data, dict):
                allowed = {
                    k: v
                    for k, v in uni_data.items()
                    if k in {"id", "name", "city", "studentsCount"}
                }
                university = University(**allowed)
            else:
                university = None

            students.append(Student(university=university, **student_json))

        return CourseWithStudents(course=course, students=students)


schema = strawberry.Schema(query=Query)
