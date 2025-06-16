import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../models/Product';
import { validate } from 'class-validator';

const productRepository = AppDataSource.getRepository(Product);

export class ProductController {
    async create(req: Request, res: Response) {
        try {
            const product = new Product();
            Object.assign(product, req.body);

            const errors = await validate(product);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const savedProduct = await productRepository.save(product);
            return res.status(201).json(savedProduct);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const product = await productRepository.findOneBy({ id: req.params.id });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.json(product);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async getAll(_req: Request, res: Response) {
        try {
            const products = await productRepository.find();
            return res.json(products);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const product = await productRepository.findOneBy({ id: req.params.id });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            Object.assign(product, req.body);
            const errors = await validate(product);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const updatedProduct = await productRepository.save(product);
            return res.json(updatedProduct);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const product = await productRepository.findOneBy({ id: req.params.id });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            await productRepository.remove(product);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async suggestTags(req: Request, res: Response) {
        try {
            const { name, description } = req.body;

            if (!name || !description) {
                return res.status(400).json({
                    message: 'Both name and description are required'
                });
            }

            // Create a prompt for the LLM to generate relevant tags
            const prompt = `Based on the following product information, suggest 5-10 relevant tags that would help categorize and find this product. Return only the tags separated by commas, without any additional text or explanation.

Product Name: ${name}
Product Description: ${description}

Tags:`;

            // Call the local LLM model (use ollama service name in Docker, fallback to localhost)
            const ollamaUrl = process.env.OLLAMA_URL || 'http://ollama:11434';
            const modelName = process.env.OLLAMA_MODEL || 'llama3.2:1b';
            const response = await fetch(`${ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: modelName,
                    prompt: prompt,
                    stream: false
                }),
            });

            if (!response.ok) {
                throw new Error(`LLM API responded with status: ${response.status}`);
            }

            const data: any = await response.json();

            // Parse the response to extract tags
            const rawTags = data.response || '';
            const suggestedTags = rawTags
                .split(',')
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag.length > 0)
                .slice(0, 10); // Limit to 10 tags maximum

            return res.json({ suggestedTags });
        } catch (error) {
            console.error('Error calling LLM API:', error);
            return res.status(500).json({
                message: 'Failed to generate tag suggestions. Please ensure the local LLM service is running.',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
} 