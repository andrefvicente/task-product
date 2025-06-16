"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const router = (0, express_1.Router)();
const productController = new ProductController_1.ProductController();
router.post('/products', productController.create);
router.get('/products/:id', productController.getOne);
router.get('/products', productController.getAll);
router.put('/products/:id', productController.update);
router.delete('/products/:id', productController.delete);
router.post('/suggest-tags', productController.suggestTags);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map