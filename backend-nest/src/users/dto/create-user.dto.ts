import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para crear usuario.
 * Validacion declarativa con class-validator.
 */
export class CreateUserDto {
  @ApiProperty({ example: 'María', description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'González', description: 'Apellido del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    example: 'maria.gonzalez@example.com',
    description: 'Correo electronico del usuario',
  })
  @IsEmail({}, { message: 'El email no tiene formato valido' })
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: '+541112345678',
    description: 'Telefono de contacto del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
