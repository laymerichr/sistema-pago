import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UsersService } from '../users/users.service';
import { CardsService } from '../cards/cards.service';
import { PythonServiceClient } from '../common/python-service.clients';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly usersService: UsersService,
    private readonly cardsService: CardsService,
    private readonly pythonServiceClient: PythonServiceClient,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const user = await this.usersService.findOne(dto.userId);

    const card = await this.cardsService.findOne(dto.cardId);
    if (card.userId !== dto.userId) {
      throw new BadRequestException(
        `La tarjeta ${dto.cardId} no pertenece al usuario ${dto.userId}`,
      );
    }
    if (!card.isActive) {
      throw new BadRequestException(
        `La tarjeta ${dto.cardId} esta inactiva y no puede usarse para pagosS.`,
      );
    }

    const processorResult = await this.pythonServiceClient.process({
      amount: dto.amount,
      currency: dto.currency || 'USD',
      card_last_four: card.lastFour,
      description: dto.description,
    });

    const payment = this.paymentRepository.create({
      userId: dto.userId,
      cardId: dto.cardId,
      amount: dto.amount,
      currency: dto.currency || 'USD',
      description: dto.description,
      status: processorResult.approved ? 'approved' : 'rejected',
      rejectionReason: processorResult.rejection_reason || null,
    });

    const saved = await this.paymentRepository.save(payment);

    this.logger.log(
      `Pago ${saved.id} | Usuario: ${dto.userId} | Estado: ${saved.status} `,
    );

    return saved;
  }

  async findByUser(userId: number): Promise<Payment[]> {
    await this.usersService.findOne(userId);

    return this.paymentRepository.find({
      where: { userId },
      relations: ['card'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'card'],
    });
    if (!payment) {
      throw new NotFoundException(`Pago con id ${id} no encontrado`);
    }
    return payment;
  }
}
