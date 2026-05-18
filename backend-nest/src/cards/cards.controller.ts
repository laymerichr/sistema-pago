import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { Card } from './entities/card.entity';

/**
 * Controller: /api/cards
 */
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() dto: CreateCardDto): Promise<Card> {
    return this.cardsService.create(dto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Card[]> {
    return this.cardsService.findByUser(userId);
  }

  @Get('deactivate/:id')
  deactivate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cardsService.deactivate(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cardsService.remove(id);
  }
}
