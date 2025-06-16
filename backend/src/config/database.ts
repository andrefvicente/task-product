import { DataSource } from 'typeorm';
import { Product } from '../models/Product';
import { User } from '../models/User';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: true,
    entities: [Product, User],
    migrations: [],
    subscribers: [],
}); 