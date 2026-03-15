#!/bin/sh
set -e

echo "Waiting for PostgreSQL at ${POSTGRES_HOST:-db}:${POSTGRES_PORT:-5432}..."
while ! nc -z "${POSTGRES_HOST:-db}" "${POSTGRES_PORT:-5432}"; do
  sleep 1
done

echo "PostgreSQL is available. Running migrations..."
python manage.py migrate --noinput

echo "Starting Django server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2 --reload
