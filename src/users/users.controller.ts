import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { UserWishesDto } from './dto/user-wishes.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  findOne(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('find')
  findUserByUsernameOrEmail(@Body() findUsersDto: FindUserDto, @Req() req) {
    const query = findUsersDto.query;
    return this.usersService.findMany(query);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  findUserByUsername(@Param('username') username: string) {
    return this.usersService.findByUsernamePublic(username);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  findWishes(@Req() req) {
    const userId = req.user.id;
    return this.usersService.findWishesById(userId);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  findWishesOtherUsers(@Param('username') username: string) {
    return this.usersService.findWishesOtherUsersById(username);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
