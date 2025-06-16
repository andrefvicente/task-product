import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { validate } from 'class-validator';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

const userRepository = AppDataSource.getRepository(User);

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, password } = req.body;

            // Check if user already exists
            const existingUser = await userRepository.findOneBy({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const user = new User();
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.password = password;

            // Validate user
            const errors = await validate(user);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            // Save user
            const savedUser = await userRepository.save(user);

            // Generate token
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
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await userRepository.findOneBy({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate token
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
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async profile(req: Request, res: Response) {
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
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            // Find user
            const user = await userRepository.findOneBy({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
            await userRepository.save(user);

            // Send reset email
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
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { token, password } = req.body;

            // Find user by reset token
            const user = await userRepository.findOneBy({ resetPasswordToken: token });
            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }

            // Check if token is expired
            if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
                return res.status(400).json({ message: 'Reset token has expired' });
            }

            // Update password
            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await userRepository.save(user);

            return res.json({ message: 'Password has been reset' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
} 