"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth_1.auth, authController.profile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map