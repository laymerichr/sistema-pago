import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para registro de pago.
 * El API valida el payload ANTES de enviarlo al procesador Python.
 */
export class CreatePaymentDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario que realiza el pago',
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 2,
    description: 'ID de la tarjeta usada para el pago',
  })
  @IsInt()
  @IsNotEmpty()
  cardId: number;

  @ApiProperty({ example: 150.5, description: 'Monto del pago', minimum: 0.01 })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Monto debe ser decimal con maximo 2 decimales' },
  )
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  amount: number;

  @ApiProperty({
    example: 'USD',
    description: 'Codigo de moneda ISO 4217',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'Currency debe ser codigo ISO de 3 letras' })
  currency?: string = 'USD';

  @ApiProperty({
    example: 'Pago de servicios',
    description: 'Descripcion opcional del pago',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
