import {
  IsString,
  IsEmail,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FindOperator } from 'typeorm';

// export class QueryDto {
//   @IsOptional()
//   @IsString()
//   username?: string;

//   @IsOptional()
//   @IsEmail()
//   email?: string;
// }

// export class FindUserDto {
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => QueryDto)
//   query: QueryDto;
// }
export class FindUserDto {
  query: string;
}
