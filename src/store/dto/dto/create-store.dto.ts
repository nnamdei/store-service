import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { StoreType } from 'src/store/enums/store-type.enum';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsEnum(StoreType)
  @IsNotEmpty()
  storeType: StoreType;

  @IsString()
  @IsOptional()
  storeDescription?: string;

  @IsString()
  @IsOptional()
  storeAddress?: string;

  @IsEmail()
  @IsOptional()
  supportEmail?: string;

  @IsPhoneNumber()
  @IsOptional()
  storePhone?: string;
}
