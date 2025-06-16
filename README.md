# Product Metadata Microservice

A TypeScript-based microservice for managing product metadata with a React admin dashboard.

## Features

- RESTful API for product management (CRUD operations)
- SQLite database for data persistence
- Swagger/OpenAPI documentation
- React admin dashboard
- Docker support for easy deployment
- Local AI-based tag suggestions using Ollama

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- SQLite with TypeORM
- Class-validator for validation
- Swagger/OpenAPI for documentation
- JWT authentication

### Frontend
- React + TypeScript
- TailwindCSS
- Vite
- Token-based authentication

## Prerequisites

- Docker and Docker Compose
- Node.js 18 or later
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd task
```

2. Start the services using Docker Compose:
```bash
docker compose down && docker compose up -d
```

This will start:
- Backend API at http://localhost:3000
- Frontend at http://localhost:5173
- SQLite database (file-based)
- Ollama with LLama3.2:1b model at http://localhost:11434

3. Access the API documentation:
- Swagger UI: http://localhost:3000/api-docs

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/profile` - Get user profile

### Products
- `POST /api/products` - Create a new product
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get a specific product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### AI Features
- `POST /api/suggest-tags` - Get AI-suggested tags using local LLM model

**Note**: The AI tag suggestion feature requires the Ollama service with a compatible model to be running. This is automatically handled when using Docker Compose.

**Model Configuration**: Currently configured to use `llama3.2:1b` for fast responses. You can change the model by updating the `OLLAMA_MODEL` environment variable in `docker-compose.yml` (e.g., to `mistral` for more advanced responses).

## Key Features Implemented

### Frontend Features
- **User Authentication**: Registration and login with session persistence
- **Product Management**: Create, read, update, and delete products
- **AI Tag Suggestions**: Smart tag generation using local LLM models
- **Responsive Design**: Modern UI built with TailwindCSS
- **Form Validation**: Client-side validation with user-friendly feedback

### Backend Features
- **RESTful API**: Complete CRUD operations for products and users
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation using class-validator
- **AI Integration**: Local LLM integration for intelligent tag suggestions
- **Database**: SQLite with TypeORM for data persistence
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation

### DevOps Features
- **Docker Support**: Complete containerization with multi-service setup
- **Hot Reload**: Development containers with live code reloading
- **Database Persistence**: Volume-mounted SQLite database
- **Network Configuration**: Proper service-to-service communication

## Development

### Backend

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start development server:
```bash
npm run dev
```

### Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

## Testing

Run tests for the backend:
```bash
cd backend
npm test
```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── entities/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── app.ts
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 