import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { Card } from './entities/card.entity';

/**
 * Controller: /api/cards
 */
@ApiTags('Tarjetas')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar tarjeta',
    description:
      'Asocia una tarjeta de credito ficticia a un usuario existente.',
  })
  @ApiBody({ type: CreateCardDto, description: 'Datos de la tarjeta' })
  @ApiResponse({
    status: 201,
    description: 'Tarjeta registrada',
    type: Card,
    schema: {
      example: {
        id: 5,
        userId: 1,
        cardNumber: '4111111111111111',
        cardHolder: 'María González',
        expirationMonth: '12',
        expirationYear: '2028',
        cvv: '123',
        brand: 'Visa',
        lastFour: '1111',
        isActive: true,
        createdAt: '2026-05-20T10:05:00.000Z',
        updatedAt: '2026-05-20T10:05:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  create(@Body() dto: CreateCardDto): Promise<Card> {
    return this.cardsService.create(dto);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Listar tarjetas por usuario',
    description: 'Retorna todas las tarjetas activas de un usuario.',
  })
  @ApiParam({ name: 'userId', description: 'ID del usuario', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarjetas',
    type: [Card],
    schema: {
      example: [
        {
          id: 5,
          userId: 1,
          cardNumber: '4111111111111111',
          cardHolder: 'María González',
          expirationMonth: '12',
          expirationYear: '2028',
          cvv: '123',
          brand: 'Visa',
          lastFour: '1111',
          isActive: true,
          createdAt: '2026-05-20T10:05:00.000Z',
          updatedAt: '2026-05-20T10:05:00.000Z',
        },
      ],
    },
  })
  findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Card[]> {
    return this.cardsService.findByUser(userId);
  }

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Activar/Desactivar tarjeta',
    description:
      'Activa/Desactiva una tarjeta del sistema según el estado anterior.',
  })
  @ApiParam({ name: 'id', description: 'ID de la tarjeta', example: 1 })
  @ApiResponse({ status: 200, description: 'Tarjeta activada/desactivada' })
  @ApiResponse({ status: 404, description: 'Tarjeta no encontrada' })
  deactivate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cardsService.deactivate(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar tarjeta',
    description: 'Elimina una tarjeta del sistema.',
  })
  @ApiParam({ name: 'id', description: 'ID de la tarjeta', example: 1 })
  @ApiResponse({ status: 200, description: 'Tarjeta eliminada' })
  @ApiResponse({ status: 404, description: 'Tarjeta no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cardsService.remove(id);
  }
}
