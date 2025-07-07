import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { SupplierModule } from './supplier/supplier.module';
import { StockLogModule } from './stock-log/stock-log.module';
import { Products } from 'src/product/entity/product.entity';
import { StockLog } from 'src/stock-log/entity/stock-log.entity';
import { Supplier } from 'src/supplier/entity/supplier.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        // synchronize: false, // ✅Set to false in production level for end user as for clients || use migrations in real world
        synchronize: true, // Set to true in development level for developers;
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // it works
        // entities: [Products,StockLog,Supplier], // it works
      }),
    }),
    SupplierModule,
    ProductModule,
    StockLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
