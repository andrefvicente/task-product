"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = require("../models/Product");
const class_validator_1 = require("class-validator");
describe('Product Model', () => {
    it('should create a valid product', async () => {
        const product = new Product_1.Product();
        product.name = 'Test Product';
        product.description = 'Test Description';
        product.price = 99.99;
        product.tags = ['test', 'example'];
        const errors = await (0, class_validator_1.validate)(product);
        expect(errors.length).toBe(0);
    });
    it('should fail validation with invalid price', async () => {
        const product = new Product_1.Product();
        product.name = 'Test Product';
        product.description = 'Test Description';
        product.price = -10;
        product.tags = ['test'];
        const errors = await (0, class_validator_1.validate)(product);
        expect(errors.length).toBeGreaterThan(0);
    });
    it('should fail validation with missing required fields', async () => {
        const product = new Product_1.Product();
        product.name = 'Test Product';
        const errors = await (0, class_validator_1.validate)(product);
        expect(errors.length).toBeGreaterThan(0);
    });
    it('should fail validation with name exceeding max length', async () => {
        const product = new Product_1.Product();
        product.name = 'a'.repeat(256);
        product.description = 'Test Description';
        product.price = 99.99;
        const errors = await (0, class_validator_1.validate)(product);
        expect(errors.length).toBeGreaterThan(0);
    });
    it('should fail validation with description exceeding max length', async () => {
        const product = new Product_1.Product();
        product.name = 'Test Product';
        product.description = 'a'.repeat(2001);
        product.price = 99.99;
        const errors = await (0, class_validator_1.validate)(product);
        expect(errors.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=Product.test.js.map