# Étape 1 : Construire l’environnement
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet
COPY . .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Exposer le port (Render détecte automatiquement)
EXPOSE 8000

RUN python manage.py migrate --noinput

# Démarrer le serveur Django avec Gunicorn
CMD ["gunicorn", "auth_service.wsgi:application", "--bind", "0.0.0.0:8000"]
