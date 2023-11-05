import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { IdPipe } from 'src/id/id.pipe';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { ProductQueryFilterDto } from 'src/products/dto/product-query-filter.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { ProductsService } from 'src/products/services/products/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('create')
  async create(@Body() createProductDto: CreateProductDto) {
    const data = await this.productService.create(createProductDto);

    return { message: 'Product created successfully', data };
  }

  @Get('')
  async findAll(
    @Query() queryFilter: ProductQueryFilterDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const data = await this.productService.findAll(
      queryFilter.storeId,
      page,
      limit,
    );

    return { message: 'Products listed successfully', data };
  }

  @Get(':productId')
  async findOne(@Param('productId', IdPipe) productId: string) {
    const data = await this.productService.findOne(productId);

    return { message: 'Product fetched successfully', data };
  }

  @Patch(':storeId/:productId/update')
  async update(
    @Param('storeId', IdPipe) storeId: string,
    @Param('productId', IdPipe) productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const data = await this.productService.update(
      storeId,
      productId,
      updateProductDto,
    );

    return { message: 'Product details updated successfully', data };
  }

  @Delete(':storeId/:productId/delete')
  async delete(
    @Param('storeId', IdPipe) storeId: string,
    @Param('productId', IdPipe) productId: string,
  ) {
    await this.productService.remove(storeId, productId);

    return { message: 'Product deleted successfully' };
  }
}
