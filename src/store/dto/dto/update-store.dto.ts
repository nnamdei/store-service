import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateStoreDto {
  @IsString()
  @IsOptional()
  address?: string;

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
