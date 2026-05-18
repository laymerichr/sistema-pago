import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

/**
 * DTO para registro de tarjeta de credito.
 * Todos los datos son ficticios para pruebas.
 */
export class CreateCardDto {
  @IsInt({ message: 'userId debe ser un numero entero' })
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @Length(13, 19, { message: 'Numero de tarjeta invalido' })
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  cardHolder: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2, { message: 'Mes debe ser 2 digitos (ej: 12)' })
  expirationMonth: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'Anio debe ser 4 digitos (ej: 2028)' })
  expirationYear: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 4, { message: 'CVV debe tener 3 o 4 digitos' })
  cvv: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  brand: string;
}
