#!/bin/sh
set -e

# Strip accidental surrounding quotes from env vars (e.g. docker run --env-file or Render paste)
strip_quotes() {
  val="$1"
  val="${val#\"}"
  val="${val%\"}"
  val="${val#\'}"
  val="${val%\'}"
  printf '%s' "$val"
}

if [ -n "$DATABASE_URL" ]; then
  DATABASE_URL="$(strip_quotes "$DATABASE_URL")"
  export DATABASE_URL
fi

if [ -n "$DATABASE_URL_POOLED" ]; then
  DATABASE_URL_POOLED="$(strip_quotes "$DATABASE_URL_POOLED")"
  export DATABASE_URL_POOLED
fi

# Fallback so setting either DATABASE_URL or DATABASE_URL_POOLED on Render works
if [ -z "$DATABASE_URL_POOLED" ] && [ -n "$DATABASE_URL" ]; then
  DATABASE_URL_POOLED="$DATABASE_URL"
  export DATABASE_URL_POOLED
fi

if [ -z "$DATABASE_URL" ] && [ -n "$DATABASE_URL_POOLED" ]; then
  DATABASE_URL="$DATABASE_URL_POOLED"
  export DATABASE_URL
fi

# Auto-generate an internal-only shared secret if not already provided
if [ -z "$INTERNAL_API_KEY" ]; then
  INTERNAL_API_KEY="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
  export INTERNAL_API_KEY
fi

# Backend binds strictly to loopback (127.0.0.1:4000) — unreachable outside the container
export BACKEND_HOST="127.0.0.1"
export BACKEND_PORT="4000"
export BACKEND_URL="http://127.0.0.1:4000"

node /app/dist-backend/server.cjs &
BACKEND_PID=$!

FRONTEND_PID=""
cleanup() {
  echo "Shutting down frontend and internal backend..."
  if [ -n "$FRONTEND_PID" ]; then
    kill -TERM "$FRONTEND_PID" 2>/dev/null || true
  fi
  kill -TERM "$BACKEND_PID" 2>/dev/null || true
  wait 2>/dev/null || true
}
trap cleanup INT TERM

# Wait for the internal backend to pass healthcheck before starting public frontend
i=0
until node -e "fetch('http://127.0.0.1:4000/internal/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; do
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "Internal backend exited unexpectedly."
    exit 1
  fi
  i=$((i + 1))
  if [ "$i" -ge 40 ]; then
    echo "Timed out waiting for internal backend."
    kill -TERM "$BACKEND_PID" 2>/dev/null || true
    exit 1
  fi
  sleep 0.5
done

# Public Next.js frontend binds to 0.0.0.0:$PORT (Render injects PORT)
export HOSTNAME="0.0.0.0"
export PORT="${PORT:-3000}"

node /app/server.js &
FRONTEND_PID=$!

# Keep container alive as long as both processes are healthy
while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null; do
  sleep 1
done

cleanup
exit 1
