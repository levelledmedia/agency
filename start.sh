#!/bin/bash
cd "$(dirname "$0")"

echo "Starting Astro dev server..."

# Start the dev server and capture output
npm run dev &
SERVER_PID=$!

echo "Waiting for server to be ready..."

# Wait for server to be ready (check for localhost:4321 to respond)
for i in {1..30}; do
  if curl -s http://localhost:4321/ > /dev/null 2>&1; then
    echo "Server is ready!"
    sleep 1
    open http://localhost:4321
    break
  fi
  sleep 1
done

echo "Server running. Press Ctrl+C to stop."

# Keep the script running so the server stays up
wait $SERVER_PID
