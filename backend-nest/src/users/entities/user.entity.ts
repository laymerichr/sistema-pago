import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Card } from '../../cards/entities/card.entity';
import { Payment } from '../../payments/entities/payment.entity';

/**
 * Entidad: usuarios
 * Almacena informacion basica del usuario.
 * Relaciones:
 *   - 1:N con tarjetas (un usuario puede tener multiples tarjetas)
 *   - 1:N con pagos (un usuario puede realizar multiples pagos)
 */
@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Card, (card) => card.user, { cascade: true })
  cards: Card[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
