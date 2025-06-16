import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5174', 'http://127.0.0.1:5174'], // Vite dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Swagger documentation
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Product Metadata API',
        version: '1.0.0',
        description: 'A REST API for managing product metadata',
    },
    components: {
        schemas: {
            Product: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    name: {
                        type: 'string',
                        maxLength: 255,
                    },
                    description: {
                        type: 'string',
                        maxLength: 2000,
                    },
                    tags: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                    price: {
                        type: 'number',
                        minimum: 0,
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                },
                required: ['name', 'description', 'price'],
            },
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                    },
                    firstName: {
                        type: 'string',
                    },
                    lastName: {
                        type: 'string',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                },
                required: ['firstName', 'lastName', 'email', 'password'],
            },
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        '/auth/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', format: 'password' },
                                },
                                required: ['firstName', 'lastName', 'email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'User registered successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/User',
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid input',
                    },
                },
            },
        },
        '/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Login user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', format: 'password' },
                                },
                                required: ['email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        token: { type: 'string' },
                                        user: {
                                            $ref: '#/components/schemas/User',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Invalid credentials',
                    },
                },
            },
        },
        '/auth/forgot-password': {
            post: {
                tags: ['Authentication'],
                summary: 'Request password reset',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                },
                                required: ['email'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Password reset email sent',
                    },
                    '404': {
                        description: 'User not found',
                    },
                },
            },
        },
        '/auth/reset-password': {
            post: {
                tags: ['Authentication'],
                summary: 'Reset password',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: { type: 'string' },
                                    password: { type: 'string', format: 'password' },
                                },
                                required: ['token', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Password reset successful',
                    },
                    '400': {
                        description: 'Invalid or expired token',
                    },
                },
            },
        },
        '/products': {
            get: {
                tags: ['Products'],
                summary: 'Get all products',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of products',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Product',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Products'],
                summary: 'Create a new product',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Product',
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Product created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Product',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/products/{id}': {
            get: {
                tags: ['Products'],
                summary: 'Get a product by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Product details',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Product',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Product not found',
                    },
                },
            },
            put: {
                tags: ['Products'],
                summary: 'Update a product',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid',
                        },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Product',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Product updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Product',
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Product not found',
                    },
                },
            },
            delete: {
                tags: ['Products'],
                summary: 'Delete a product',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid',
                        },
                    },
                ],
                responses: {
                    '204': {
                        description: 'Product deleted successfully',
                    },
                    '404': {
                        description: 'Product not found',
                    },
                },
            },
        },
        '/suggest-tags': {
            post: {
                tags: ['Products'],
                summary: 'Suggest tags for a product using local LLM',
                description: 'Generate relevant tags for a product based on its name and description using a local Mistral model',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        description: 'Product name',
                                        example: 'Wireless Headphones'
                                    },
                                    description: {
                                        type: 'string',
                                        description: 'Product description',
                                        example: 'High-quality noise-cancelling wireless headphones with 30-hour battery life and premium sound quality'
                                    },
                                },
                                required: ['name', 'description'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Tags suggested successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        suggestedTags: {
                                            type: 'array',
                                            items: {
                                                type: 'string'
                                            },
                                            description: 'Array of suggested tags',
                                            example: ['wireless', 'headphones', 'noise-cancelling', 'audio', 'bluetooth']
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid input - missing name or description',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Both name and description are required'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'LLM service error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Failed to generate tag suggestions. Please ensure the local LLM service is running.'
                                        },
                                        error: {
                                            type: 'string'
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            },
        },
    },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize database and start server
AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
        });
    })
    .catch((error) => console.log('TypeORM connection error: ', error)); 