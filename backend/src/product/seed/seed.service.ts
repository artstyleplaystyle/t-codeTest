import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async run() {
    const productData = [
      {
        name: 'test 1',
        description: 'test 1',
        price: this.getRandomNumber(5000, 20000),
        discount: this.getRandomNumber(10, 50),
        sku: uuidv4(),
        photo: undefined,
      },
      {
        name: 'test 2',
        description: 'test 2',
        price: this.getRandomNumber(5000, 20000),
        discount: this.getRandomNumber(10, 50),
        sku: uuidv4(),
        photo: undefined,
      },
    ];

    const existingProducts = await this.productRepository.find({
      where: productData.map((p) => ({ name: p.name })),
    });

    const newProducts = productData.filter(
      (p) => !existingProducts.some((ep) => ep.name === p.name),
    );

    if (newProducts.length === 0) {
      this.logger.log(
        'Все тестовые продукты уже существуют, пропускаем сидинг.',
      );
      return;
    }

    await this.productRepository.insert(
      newProducts.map((product) => ({ ...product })),
    );

    this.logger.log(`Добавлено ${newProducts.length} продуктов.`);
  }
}
