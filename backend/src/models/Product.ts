import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsNumber, Min, MaxLength, IsArray } from 'class-validator';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @Column({ length: 2000 })
    @IsNotEmpty()
    @IsString()
    @MaxLength(2000)
    description: string;

    @Column('simple-array')
    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @Column('decimal', { precision: 10, scale: 2 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 