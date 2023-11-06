import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Price cannot be less than 1' })
  price?: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Quantity cannot be less than 1' })
  quantity?: number;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsMongoId()
  @IsNotEmpty()
  storeId?: string;
}
