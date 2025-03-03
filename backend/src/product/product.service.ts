import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
    const product = this.productRepository.create({
      ...createProductDto,
      photo: photoPath,
    });
    return await this.productRepository.save(product);
  }

  async findAll(query: any): Promise<{ data: Product[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'id', order = 'ASC', name } = query;
    const skip = (page - 1) * limit;

    const qb = this.productRepository.createQueryBuilder('product');
    if (name) {
      qb.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    qb.orderBy(`product.${sortBy}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

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
    Object.assign(product, updateProductDto);
    if (photoPath) {
      product.photo = photoPath;
    }
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      return false;
    }
    await this.productRepository.remove(product);
    return true;
  }


  async removePhoto(id: number): Promise<Product> {
    const product = await this.findOne(id);
    product.photo = undefined;
    return await this.productRepository.save(product);
  }
}
