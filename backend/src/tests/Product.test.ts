import { Product } from '../models/Product';
import { validate } from 'class-validator';

describe('Product Model', () => {
    it('should create a valid product', async () => {
        const product = new Product();
        product.name = 'Test Product';
        product.description = 'Test Description';
        product.price = 99.99;
        product.tags = ['test', 'example'];

        const errors = await validate(product);
        expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid price', async () => {
        const product = new Product();
        product.name = 'Test Product';
        product.description = 'Test Description';
        product.price = -10;
        product.tags = ['test'];

        const errors = await validate(product);
        expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with missing required fields', async () => {
        const product = new Product();
        product.name = 'Test Product';
        // Missing description and price

        const errors = await validate(product);
        expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with name exceeding max length', async () => {
        const product = new Product();
        product.name = 'a'.repeat(256); // Exceeds 255 characters
        product.description = 'Test Description';
        product.price = 99.99;

        const errors = await validate(product);
        expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with description exceeding max length', async () => {
        const product = new Product();
        product.name = 'Test Product';
        product.description = 'a'.repeat(2001); // Exceeds 2000 characters
        product.price = 99.99;

        const errors = await validate(product);
        expect(errors.length).toBeGreaterThan(0);
    });
}); 