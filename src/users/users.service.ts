import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {
  FindManyOptions,
  FindOneOptions,
  IsNull,
  Repository,
  W,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { emitKeypressEvents } from 'readline';
import { hashPassword } from 'src/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const newHashPassword = await hashPassword(password);
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: newHashPassword,
    });

    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    return user;
  }

  async findByUsername(username: FindOneOptions<User>) {
    const user = await this.usersRepository.findOne(username);

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('Запрашиваемый пользователь не найден');
    }
    const newInfoUser = this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });

    return newInfoUser;
  }
  //реализация метода поиска пользователей через массив условий
  async findMany(query: string): Promise<User[]> {
    const foundUser = await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
    });
    return foundUser;
  }

  async findByUsernamePublic(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new Error('Запрашиваемый пользователь не найден');
    }
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
    //const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('Запрашиваемый пользователь не найден');
    }

    return user.wishes;
  }

  async findWishesOtherUsersById(username: string): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        wishes: true,
      },
    });

    if (!user) {
      throw new Error('Запрашиваемый пользователь не найден');
    }
    return user.wishes;
  }
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
