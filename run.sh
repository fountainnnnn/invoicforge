#!/bin/bash
echo "Starting InvoiceForge..."
lsof -ti:5910 | xargs kill -9 2>/dev/null
lsof -ti:5920 | xargs kill -9 2>/dev/null
echo "Starting backend on :5920..."
node server/index.cjs &
sleep 1
echo "Starting frontend on :5910..."
npx vite --port 5910 --host 127.0.0.1
