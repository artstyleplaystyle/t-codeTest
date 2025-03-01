import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DB,
  entities: [Product],
  synchronize: process.env.NODE_ENV !== 'production',
  autoLoadEntities: true,
};

export default databaseConfig;
