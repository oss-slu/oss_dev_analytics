#!/bin/bash

echo "🚀 Starting OSS_Dev_Analytics Setup..."

# 1. Backend Setup
echo "📦 Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    echo "✅ Python dependencies installed."
else
    echo "❌ requirements.txt not found!"
fi

# 2. Frontend Setup
echo "📦 Installing Frontend dependencies (React + Vite)..."
if [ -d "frontend" ]; then
    cd frontend
    npm install
<<<<<<< HEAD
    npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
=======
>>>>>>> main
    echo "✅ Frontend dependencies installed."
    cd ..
else
    echo "⚠️ Frontend directory not found. Skipping npm install."
fi

<<<<<<< HEAD
echo "🎉 Setup Complete! Remember to configure your GIT_TOKEN in config/.env"
=======
echo "🎉 Setup Complete! Remember to configure your GIT_TOKEN in config/configs.py."
>>>>>>> main
