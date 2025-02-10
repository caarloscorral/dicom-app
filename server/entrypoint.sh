#!/bin/bash
# Waiting for the database to be ready
until nc -z -v -w30 mysql 3306; do
  echo "Waiting until database is avaialble in mysql:3306..."
  sleep 5
done

# Activating virtual environment
source /app/venv/bin/activate

# Running command passed after entrypoint in Dockerfile
exec "$@"