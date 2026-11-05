FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Migrations run at start-up, once the database is reachable
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn chatbot_project.wsgi:application --bind 0.0.0.0:8000 --workers 1 --timeout 300"]
