import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Contains,
  IsNotEmpty,
  Length,
  IsUrl,
  IsEmail,
  IsString,
} from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('varchar', { nullable: false, unique: true })
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @Column('varchar')
  @Length(2, 200)
  @Contains('Пока ничего не рассказал о себе')
  about: string;

  @Column('varchar')
  @IsUrl()
  @Contains('https://i.pravatar.cc/300')
  avatar: string;

  @Column('varchar', { unique: true })
  @IsEmail()
  email: string;

  @Column('varchar', { nullable: false, unique: true })
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
