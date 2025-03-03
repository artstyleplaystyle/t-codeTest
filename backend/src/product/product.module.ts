import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SeedService } from './seed/seed.service';
import { SeedModule } from './seed/seed.module';
import { AppController } from '../app.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SeedModule],
  providers: [ProductService, SeedService],
  controllers: [ProductController, AppController],
})
export class ProductModule {}
