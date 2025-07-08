import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Products } from './src/product/entity/product.entity';
import { StockLog } from 'src/stock-log/entity/stock-log.entity';
import { Supplier } from 'src/supplier/entity/supplier.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.URL, // For Production
    // host: process.env.DB_HOST,
    // port: +process.env.DB_PORT!,
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // entities: [Products,StockLog,Supplier],
    entities: [__dirname + '/**/*.entity{.js,.ts}'],
    migrations: [__dirname + '/src/migrations/*{.js,.ts}'],
    synchronize: false,
});
