import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}

export class ProductQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  @IsIn(['id', 'name', 'price', 'createdAt', 'discount'])
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Price cannot be negative' })
  readonly price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Discount cannot be negative' })
  @Max(100, { message: 'Discount cannot be more than 100%' })
  readonly discount?: number;

  @IsString()
  @IsOptional()
  @Matches(/^SKU-[A-Z0-9]+$/, {
    message: 'SKU must start with "SKU-" followed by uppercase letters and numbers',
  })
  readonly sku?: string;

  @IsString()
  @IsOptional()
  readonly photo?: string;
}
