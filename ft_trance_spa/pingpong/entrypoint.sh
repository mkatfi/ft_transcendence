#!/bin/bash
sleep 10
# pip install psycopg2-binary 
# echo "apply database migration"
# python  manage.py migrate


# Collect static files
echo "Collecting static files"
python manage.py collectstatic --noinput

# Apply database migrations
echo "Applying database migrations"
python manage.py migrate
exec "$@"