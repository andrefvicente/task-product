"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const class_validator_1 = require("class-validator");
const crypto = __importStar(require("crypto"));
const nodemailer = __importStar(require("nodemailer"));
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
class AuthController {
    async register(req, res) {
        try {
            const { firstName, lastName, email, password } = req.body;
            const existingUser = await userRepository.findOneBy({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const user = new User_1.User();
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.password = password;
            const errors = await (0, class_validator_1.validate)(user);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
            const savedUser = await userRepository.save(user);
            const token = savedUser.generateAuthToken();
            return res.status(201).json({
                user: {
                    id: savedUser.id,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    email: savedUser.email,
                },
                token,
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userRepository.findOneBy({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = user.generateAuthToken();
            return res.json({
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
                token,
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
    async profile(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            return res.json({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await userRepository.findOneBy({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000);
            await userRepository.save(user);
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
            await transporter.sendMail({
                to: user.email,
                subject: 'Password Reset',
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>
                    <p>This link will expire in 1 hour.</p>
                `,
            });
            return res.json({ message: 'Password reset email sent' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            const user = await userRepository.findOneBy({ resetPasswordToken: token });
            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }
            if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
                return res.status(400).json({ message: 'Reset token has expired' });
            }
            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await userRepository.save(user);
            return res.json({ message: 'Password has been reset' });
        }
        catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map