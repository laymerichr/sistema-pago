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

/**
 * DTO para registro de pago.
 * El API valida el payload ANTES de enviarlo al procesador Python.
 */
export class CreatePaymentDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  cardId: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Monto debe ser decimal con maximo 2 decimales' },
  )
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  amount: number;

  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'Currency debe ser codigo ISO de 3 letras' })
  currency?: string = 'USD';

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
