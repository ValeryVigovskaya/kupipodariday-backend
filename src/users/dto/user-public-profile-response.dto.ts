import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsNumber,
  Length,
} from 'class-validator';

export class UserPublicProfileResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @IsString()
  @Length(2, 200)
  @IsNotEmpty()
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
