import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import {
  Contains,
  IsNotEmpty,
  Length,
  IsUrl,
  IsEmail,
  IsString,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('varchar', { nullable: false })
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @Column('varchar')
  @IsUrl()
  link: string;

  @Column('varchar')
  @IsUrl()
  image: string;

  @Column('decimal', { scale: 2 })
  price: number;

  @Column('decimal', { scale: 2, nullable: true })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column('varchar')
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  @JoinTable()
  wishlists: Wishlist[];

  @Column('int', { default: 0 })
  copied: number;
}
