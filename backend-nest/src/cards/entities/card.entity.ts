import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';

/**
 * Entidad: tarjetas
 * Almacena datos de tarjetas de credito asociadas a usuarios.
 */
@Entity('tarjetas')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'card_number', type: 'varchar', length: 16 })
  cardNumber: string;

  @Column({ name: 'card_holder', type: 'varchar', length: 255 })
  cardHolder: string;

  @Column({ name: 'expiration_month', type: 'varchar', length: 2 })
  expirationMonth: string;

  @Column({ name: 'expiration_year', type: 'varchar', length: 4 })
  expirationYear: string;

  @Column({ type: 'varchar', length: 4 })
  cvv: string;

  @Column({ type: 'varchar', length: 20 })
  brand: string;

  @Column({ name: 'last_four', type: 'varchar', length: 4 })
  lastFour: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Payment, (payment) => payment.card)
  payments: Payment[];
}
