#!/bin/bash

echo "🚀 Starting AI Interview Assistant Development Environment"
echo ""

echo "📊 Starting Backend Server..."
cd server
npm run dev &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 3

echo "🎨 Starting Frontend..."
cd ..
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started!"
echo "📡 Backend: http://localhost:4000"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait