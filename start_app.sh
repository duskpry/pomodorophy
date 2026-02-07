#!/bin/bash
echo "Stoic Pomodoro Timer - Launching..."

# Setup local node environment
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
NODE_DIR="$SCRIPT_DIR/node-v20.11.0-darwin-arm64/bin"
export PATH="$NODE_DIR:$PATH"

echo "Using Node.js from: $(which node)"
echo "Node version: $(node -v)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the app
echo "Starting Application..."
npm start
