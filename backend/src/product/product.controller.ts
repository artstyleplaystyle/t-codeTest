import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';

const fileStorageConfig = () =>
  diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = uuidv4();
      const fileExtName = extname(file.originalname);
      callback(null, `${uniqueSuffix}${fileExtName}`);
    },
  });

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', { storage: fileStorageConfig() }))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const photoPath = file?.filename;
    const sku = createProductDto.sku || `SKU-${uuidv4()}`;

    try {
      return await this.productService.create({ ...createProductDto, sku }, photoPath);
    } catch (error) {
      throw new BadRequestException('Товар не создался');
    }
  }

  @Get()
  async findAll(@Query() query: FindProductsDto) {
    return await this.productService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo', { storage: fileStorageConfig() }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const photoPath = file?.filename;
    return await this.productService.update(id, updateProductDto, photoPath);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productService.remove(id);
    return { success: true };
  }

  @Delete(':id/photo')
  async removePhoto(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.removePhoto(id);
  }
}
