import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @Column({ unique: true })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @Column({ nullable: true })
    resetPasswordToken?: string;

    @Column({ nullable: true })
    resetPasswordExpires?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    generateAuthToken(): string {
        return jwt.sign(
            { id: this.id, email: this.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
    }
} 