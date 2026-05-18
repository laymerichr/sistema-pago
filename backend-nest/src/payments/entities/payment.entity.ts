import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../cards/entities/card.entity';

/**
 * Entidad: pagos
 * Registro inmutable de cada intento de pago.
 * El status refleja la respuesta del servicio Python processor.
 */
@Entity('pagos')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'card_id', type: 'int' })
  cardId: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({
    name: 'rejection_reason',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  rejectionReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Card, (card) => card.payments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'card_id' })
  card: Card;
}