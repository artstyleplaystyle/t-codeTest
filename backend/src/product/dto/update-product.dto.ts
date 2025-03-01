import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsOptional()
  readonly price?: number;

  @IsNumber()
  @IsOptional()
  readonly discount?: number;

  @IsString()
  @IsOptional()
  readonly sku?: string;

  @IsString()
  @IsOptional()
  readonly photo?: string;
}
