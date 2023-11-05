import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { ProductStatus } from '../enums/product-status.enum';

export class ProductQueryFilterDto {
  @IsMongoId()
  @IsOptional()
  storeId?: string;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}
