import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    photoPath?: string,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new BadRequestException(
        `Product with name "${createProductDto.name}" already exists`,
      );
    }

    const product = this.productRepository.create({
      ...createProductDto,
      photo: photoPath || undefined,
    });

    return await this.productRepository.save(product);
  }

  async findAll(
    query: FindProductsDto,
  ): Promise<{ data: Product[]; total: number }> {
    const validSortColumns = ['id', 'name', 'price', 'createdAt'];

    const pageNumber = Math.max(Number(query.page) || 1, 1);
    const limitNumber = Math.max(Number(query.limit) || 10, 1);
    const sortBy = query.sortBy ?? 'id';
    const sortByColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';
    const orderBy = query.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const qb = this.productRepository.createQueryBuilder('product');

    if (query.name) {
      qb.andWhere('product.name ILIKE :name', { name: `%${query.name}%` });
    }

    qb.orderBy(`product.${sortByColumn}`, orderBy)
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber);
    
    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    photoPath?: string,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (photoPath && product.photo) {
      this.deletePhotoFile(product.photo);
    }

    Object.assign(product, updateProductDto);

    if (photoPath) {
      product.photo = photoPath;
    }

    return await this.productRepository.save(product);
  }


  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);

    if (product.photo) {
      this.deletePhotoFile(product.photo);
    }

    await this.productRepository.remove(product);
    return; 
  }

  async removePhoto(id: number): Promise<Product> {
    const product = await this.findOne(id);
    if (product.photo) {
      this.deletePhotoFile(product.photo);
      product.photo = undefined;
    }

    return await this.productRepository.save(product);
  }

  private deletePhotoFile(photo: string): void {
    const filePath = path.join(__dirname, '..', '..', 'uploads', photo);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
