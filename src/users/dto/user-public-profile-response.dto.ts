import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsNumber,
} from 'class-validator';

export class UserPublicProfileResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;
}
