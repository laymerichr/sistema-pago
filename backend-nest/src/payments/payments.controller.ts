import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';

@ApiTags('Pagos')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar pago',
    description: 'Registra un nuevo pago en el sistema.',
  })
  @ApiBody({ type: CreatePaymentDto, description: 'Datos del pago' })
  @ApiResponse({
    status: 201,
    description: 'Pago registrado',
    type: Payment,
    schema: {
      example: {
        id: 12,
        userId: 1,
        cardId: 2,
        amount: 150.5,
        currency: 'USD',
        description: 'Compra de prueba',
        status: 'approved',
        rejectionReason: null,
        createdAt: '2026-05-20T10:30:00.000Z',
        updatedAt: '2026-05-20T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() dto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(dto);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Listar pagos por usuario',
    description: 'Obtiene los pagos realizados por un usuario.',
  })
  @ApiParam({ name: 'userId', description: 'ID del usuario', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos',
    type: [Payment],
    schema: {
      example: [
        {
          id: 12,
          userId: 1,
          cardId: 2,
          amount: 150.5,
          currency: 'USD',
          description: 'Compra de prueba',
          status: 'approved',
          rejectionReason: null,
          createdAt: '2026-05-20T10:30:00.000Z',
          updatedAt: '2026-05-20T10:30:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Payment[]> {
    return this.paymentsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener pago por ID',
    description: 'Retorna un pago específico por su identificador.',
  })
  @ApiParam({ name: 'id', description: 'ID del pago', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Pago encontrado',
    type: Payment,
    schema: {
      example: {
        id: 12,
        userId: 1,
        cardId: 2,
        amount: 150.5,
        currency: 'USD',
        description: 'Compra de prueba',
        status: 'approved',
        rejectionReason: null,
        createdAt: '2026-05-20T10:30:00.000Z',
        updatedAt: '2026-05-20T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }
}
