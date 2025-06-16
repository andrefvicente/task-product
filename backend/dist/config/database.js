"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: true,
    entities: [Product_1.Product, User_1.User],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=database.js.map