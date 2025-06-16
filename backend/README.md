# Product Metadata Service

A TypeScript-based microservice that exposes a REST API for managing product metadata.

## Features

- Full CRUD operations for products
- Input validation
- Swagger/OpenAPI documentation
- SQLite database with TypeORM
- Docker support
- Unit tests

## Prerequisites

- Node.js (v18 or higher)
- npm
- Docker and Docker Compose (optional)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd product-metadata-service
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Using Docker

```bash
docker-compose up
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

- `POST /api/products` - Create a new product
- `GET /api/products/:id` - Get a product by ID
- `GET /api/products` - Get all products
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Running Tests

```bash
npm test
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── utils/          # Utility functions
└── tests/          # Test files
```

## License

ISC 