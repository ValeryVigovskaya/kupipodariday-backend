import { HttpCode, Injectable, UseGuards } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/guards/jwt.guard';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async create(createWishDto: CreateWishDto, id: number): Promise<Wish> {
    //находим нужного юзера
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        wishes: true,
      },
    });

    //создаем подарок с добавлением значения юзера
    const wish = await this.wishRepository.create({
      ...createWishDto,
      owner: user,
    });
    user.wishes.push(wish);
    //с объявлением константы подарок не сразу отображался на фронте
    await this.usersRepository.save(user);
    return this.wishRepository.save(wish);
  }

  async findLastWishes(): Promise<Wish[]> {
    const sortWishes = await this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      skip: 0,
      take: 10,
    });
    return sortWishes;
  }

  async findTopWishes(): Promise<Wish[]> {
    const sortWishes = await this.wishRepository.find({
      order: {
        createdAt: 'ASC',
      },
      skip: 0,
      take: 10,
    });
    return sortWishes;
  }

  async findWishById(id: number): Promise<Wish | undefined> {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: {
        owner: true,
        offers: true,
        wishlists: true,
      },
    });

    if (!wish) {
      throw new Error('Запрашиваемый подарок не найден');
    }

    return wish;
  }

  findAll() {
    return `This action returns all wishes`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} wish`;
  // }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish | undefined> {
    const wish = await this.wishRepository.findOneBy({ id });
    if (!wish) {
      throw new Error('Запрашиваемый подарок не найден');
    }

    if (!wish.owner) {
      throw new Error('Владелец подарка не найден');
    }
    const user = await this.usersRepository.findOneBy({ id: wish.owner.id });
    // if (!user) {
    //   throw new Error('Запрашиваемый пользователь не найден');
    // }
    const newWish = this.wishRepository.save({
      ...wish,
      ...updateWishDto,
    });
    return newWish;
  } //пока не работает

  async copyWishById(id: number, userId: number): Promise<Wish> {
    //находим подарок по йади
    const wish = await this.wishRepository.findOneBy({ id });
    //находим владельца
    const ownerWish = await this.usersRepository.findOne({
      where: {
        wishes: wish,
      },
    });
    //добавляем счетчик копий на подарок
    wish.copied++;
    //добавляем владельцу количесто копий
    await this.usersRepository.save(ownerWish);
    //находим юзера
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        wishes: true,
      },
    });
    //добавляем подарок юзеру в массив

    await this.usersRepository.save(user);
    return this.wishRepository.save(wish);
  } //пока метод не работает

  async remove(id: number, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: {
        owner: true,
        offers: true,
        wishlists: true,
      },
    });
    if (!wish) {
      throw new Error('Пожелание не найдено');
    }
    if (wish.owner.id !== userId) {
      throw new Error('Запрашиваемый подарок создан другим пользователем');
    }

    return this.wishRepository.remove(wish);
  }
}
