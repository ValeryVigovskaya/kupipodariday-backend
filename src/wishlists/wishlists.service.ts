import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(data: CreateWishlistDto, userId: number): Promise<Wishlist> {
    // //находим нужного юзера
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        wishlists: true,
      },
    });

    //создаем вишлист с добавлением значения юзера
    const wishlist = this.wishlistRepository.create({
      ...data,
      owner: user,
      items: [],
    });

    if (data?.itemsId) {
      await Promise.all(
        data?.itemsId.map(async (wishId) => {
          const wish = await this.wishRepository.findOneBy({ id: wishId });
          wishlist.items.push(wish);
          //wish.wishlists.push(wishlist);
        }),
      );
    }
    user.wishlists.push(wishlist);
    await this.usersRepository.save(user);
    return this.wishlistRepository.save(wishlist);
  }

  async findAll(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
    return wishlists;
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        items: true,
        owner: true,
      },
    });
    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    //находим вишлист
    const wishlist = await this.wishlistRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) {
      throw new Error('Запрашиваемый вишлист не найден');
    }
    const repeatItem = (item: number) =>
      updateWishlistDto?.itemsId.find((itemId) => itemId === item);

    const removeItem = wishlist.items.filter((item) => repeatItem(item.id));
    //удаляем повтор подарков  из вишлиста и сохраняем
    const wishlistWithRemoveItems = await this.wishlistRepository.save({
      ...wishlist,
      items: removeItem,
    });
    if (updateWishlistDto?.itemsId) {
      await Promise.all(
        updateWishlistDto?.itemsId.map(async (wishId) => {
          //проверяем, какие элементы существуют в обновленном вишлисте
          const existingItem = wishlistWithRemoveItems.items.find(
            (item) => item.id === wishId,
          );
          //если таких нет, ищем и добавляем
          if (!existingItem) {
            const wish = await this.wishRepository.findOneBy({ id: wishId });
            wishlistWithRemoveItems.items.push(wish);
          }
        }),
      );
    }
    return this.wishlistRepository.save(wishlistWithRemoveItems);
  } //вариант работает

  async remove(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: id },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) {
      throw new Error('Вишлист не найден');
    }
    if (wishlist.owner.id !== userId) {
      throw new Error('Запрашиваемый вишлист создан другим пользователем');
    }

    return this.wishlistRepository.remove(wishlist);
  }
}
