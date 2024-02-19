import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(
    userId: number,
    offer: CreateOfferDto,
    itemId: number,
  ): Promise<Offer> {
    //находим нужного юзера
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        offers: true,
      },
    });
    const wish = await this.wishRepository.findOne({
      where: {
        id: itemId,
      },
      relations: {
        offers: true,
      },
    });
    const newOffer = await this.offerRepository.create({
      ...offer,
      user: user,
      item: wish,
    });
    user.offers.push(newOffer);
    wish.offers.push(newOffer);
    await this.usersRepository.save(user);
    await this.wishRepository.save(wish);
    return this.offerRepository.save(newOffer);
  } //пока не работает

  findAll() {
    return `This action returns all offers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
