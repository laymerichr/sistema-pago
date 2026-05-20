import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para registro de tarjeta de credito.
 * Todos los datos son ficticios para pruebas.
 */
export class CreateCardDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario propietario de la tarjeta',
  })
  @IsInt({ message: 'userId debe ser un numero entero' })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: '4111111111111111',
    description: 'Numero de tarjeta de credito o debito',
  })
  @IsString()
  @IsNotEmpty()
  @Length(13, 19, { message: 'Numero de tarjeta invalido' })
  cardNumber: string;

  @ApiProperty({
    example: 'María González',
    description: 'Nombre del titular de la tarjeta',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  cardHolder: string;

  @ApiProperty({
    example: '12',
    description: 'Mes de expiracion en formato MM',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2, { message: 'Mes debe ser 2 digitos (ej: 12)' })
  expirationMonth: string;

  @ApiProperty({
    example: '2028',
    description: 'Año de expiracion en formato AAAA',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'Anio debe ser 4 digitos (ej: 2028)' })
  expirationYear: string;

  @ApiProperty({
    example: '123',
    description: 'Codigo de seguridad CVV/CVC de la tarjeta',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 4, { message: 'CVV debe tener 3 o 4 digitos' })
  cvv: string;

  @ApiProperty({ example: 'Visa', description: 'Marca de la tarjeta' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  brand: string;
}
