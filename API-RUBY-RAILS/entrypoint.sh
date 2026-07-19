#!/bin/bash
set -e

cd /app
rm -f tmp/pids/server.pid

echo "===> Aguardando MariaDB em ${DB_HOST:-db}:${DB_PORT:-3306}..."
until (echo > /dev/tcp/${DB_HOST:-db}/${DB_PORT:-3306}) 2>/dev/null; do
  echo "MariaDB ainda não está pronto, aguardando..."
  sleep 2
done
echo "✅ MariaDB pronto!"

echo "===> Preparando banco..."
bundle exec rails db:prepare RAILS_ENV=${RAILS_ENV:-development}

echo "===> Iniciando Rails..."
exec bundle exec rails server -b 0.0.0.0 -p 3000