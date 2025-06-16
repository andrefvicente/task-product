#!/bin/bash

# Create necessary directories
mkdir -p backend/src/{models,repositories,services,config,db}
mkdir -p frontend/src/{components,pages,services}

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..

# Start the services
docker-compose up -d

echo "Project initialized successfully!"
echo "Backend API is available at http://localhost:3000"
echo "Frontend is available at http://localhost"
echo "API documentation is available at http://localhost:3000/documentation" 