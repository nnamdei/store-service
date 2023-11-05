import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(8)
  @IsOptional()
  password: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  newPassword: string;

  @IsNumberString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  firstName: string;
}
