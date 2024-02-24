import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {
  FindManyOptions,
  FindOneOptions,
  IsNull,
  QueryFailedError,
  Repository,
  W,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { SALT, hashPassword } from 'src/utils/bcrypt';
import { UserWishesDto } from './dto/user-wishes.dto';
import { BadRequestExceptionCustom } from 'src/errors/bad-request-err';
import { ConflictExceptionCustom } from 'src/interceptors/conflict-eception';
import { AllExceptionsFilter } from 'src/interceptors/exceptions-filter';
import { validate } from 'class-validator';
import { NotFoundExceptionCustom } from 'src/interceptors/not-found';

@Injectable()
//@UseFilters(AllExceptionsFilter)
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const newHashPassword = await hashPassword(password);
    try {
      const user = await this.usersRepository.create({
        ...createUserDto,
        password: newHashPassword,
      });
      const saveUser = await this.usersRepository.save(user);
      delete saveUser.password;
      return saveUser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;

        if (err.code === '23505') {
          throw new ConflictExceptionCustom();
        }
      }
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundExceptionCustom();
    }
    return user;
  }

  async findByUsername(username: FindOneOptions<User>): Promise<User> {
    const user = await this.usersRepository.findOne(username);
    if (!user) {
      throw new NotFoundExceptionCustom();
    }
    return user;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserPublicProfileResponseDto> {
    try {
      const userPassword = updateUserDto.password;
      const user = await this.usersRepository.findOneBy({ id });

      if (userPassword) {
        updateUserDto.password = await hashPassword(userPassword);
      }

      const { password, ...result } = updateUserDto;

      return this.usersRepository.save({ ...user, ...result });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        // ошибка не отображается на фронте, но помогает не менять
        // на уже имеющиеся данные
        if (err.code === '23505') {
          throw new ConflictExceptionCustom();
        }
      }
    }
  }
  //реализация метода поиска пользователей через массив условий
  async findMany(query: string): Promise<User[]> {
    const foundUser = await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
    });
    if (!foundUser) {
      throw new NotFoundExceptionCustom();
    }
    return foundUser;
  }

  async findByUsernamePublic(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new NotFoundExceptionCustom();
    }
    delete user.email;
    return this.usersRepository.save(user);
  }

  async findWishesById(userId: number): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        wishes: true,
      },
    });
    delete user.email;
    await this.usersRepository.save(user);
    return user.wishes;
  }

  async findWishesOtherUsersById(username: string): Promise<UserWishesDto[]> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        wishes: true,
      },
    });

    if (!user) {
      throw new NotFoundExceptionCustom();
    }
    return user.wishes;
  }
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
