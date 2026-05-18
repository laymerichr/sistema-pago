import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UsersService } from '../users/users.service';

/**
 * Servicio de dominio: Tarjetas
 * Gestiona el registro de tarjetas ficticias asociadas a usuarios.
 */
@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateCardDto): Promise<Card> {
    const userExists = await this.usersService.exists(dto.userId);
    if (!userExists) {
      throw new NotFoundException(`Usuario ${dto.userId} no existe. No se puede registrar tarjeta.`);
    }

    const lastFour = dto.cardNumber.slice(-4);

    const card = this.cardRepository.create({
      ...dto,
      lastFour,
      isActive: true,
    });

    return this.cardRepository.save(card);
  }

  async findByUser(userId: number): Promise<Card[]> {
    return this.cardRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Tarjeta con id ${id} no encontrada`);
    }
    return card;
  }

  async deactivate(id: number): Promise<void> {
    const card = await this.findOne(id);
    card.isActive = false;
    await this.cardRepository.save(card);
  }
}