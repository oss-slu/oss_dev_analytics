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
    echo "✅ Frontend dependencies installed."
    cd ..
else
    echo "⚠️ Frontend directory not found. Skipping npm install."
fi

echo "🎉 Setup Complete! Remember to configure your GIT_TOKEN in config/configs.py."