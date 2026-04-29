#!/usr/bin/env bash
# exit on error
set -o errexit

# Install production requirements (includes PostgreSQL)
pip install -r requirements-prod.txt

python manage.py collectstatic --no-input
python manage.py migrate
