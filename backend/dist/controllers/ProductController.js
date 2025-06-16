"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const database_1 = require("../config/database");
const Product_1 = require("../models/Product");
const class_validator_1 = require("class-validator");
const productRepository = database_1.AppDataSource.getRepository(Product_1.Product);
class ProductController {
    async create(req, res) {
        try {
            const product = new Product_1.Product();
            Object.assign(product, req.body);
            const errors = await (0, class_validator_1.validate)(product);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
            const savedProduct = await productRepository.save(product);
            return res.status(201).json(savedProduct);
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
    async getOne(req, res) {
        try {
            const product = await productRepository.findOneBy({ id: req.params.id });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.json(product);
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
    async getAll(_req, res) {
        try {
            const products = await productRepository.find();
            return res.json(products);
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
    async update(req, res) {
        try {
            const product = await productRepository.findOneBy({ id: req.params.id });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            Object.assign(product, req.body);
            const errors = await (0, class_validator_1.validate)(product);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
            const updatedProduct = await productRepository.save(product);
            return res.json(updatedProduct);
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
    async delete(req, res) {
        try {
            const product = await productRepository.findOneBy({ id: req.params.id });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            await productRepository.remove(product);
            return res.status(204).send();
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
    async suggestTags(req, res) {
        try {
            const { name, description } = req.body;
            if (!name || !description) {
                return res.status(400).json({
                    message: 'Both name and description are required'
                });
            }
            const prompt = `Based on the following product information, suggest 5-10 relevant tags that would help categorize and find this product. Return only the tags separated by commas, without any additional text or explanation.

Product Name: ${name}
Product Description: ${description}

Tags:`;
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'mistral',
                    prompt: prompt,
                    stream: false
                }),
            });
            if (!response.ok) {
                throw new Error(`LLM API responded with status: ${response.status}`);
            }
            const data = await response.json();
            const rawTags = data.response || '';
            const suggestedTags = rawTags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0)
                .slice(0, 10);
            return res.json({ suggestedTags });
        }
        catch (error) {
            console.error('Error calling LLM API:', error);
            return res.status(500).json({
                message: 'Failed to generate tag suggestions. Please ensure the local LLM service is running.',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map