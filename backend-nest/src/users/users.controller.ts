import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

/**
 * Controller: /api/users
 * Expone endpoints RESTful para gestion de usuarios.
 */
@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description: 'Registra un usuario en el sistema con datos básicos.',
  })
  @ApiBody({ type: CreateUserDto, description: 'Datos del usuario a crear' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: User,
    schema: {
      example: {
        id: 1,
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@example.com',
        phone: '+541112345678',
        createdAt: '2026-05-20T10:00:00.000Z',
        updatedAt: '2026-05-20T10:00:00.000Z',
        cards: [],
        payments: [],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los usuarios',
    description: 'Retorna todos los usuarios con sus tarjetas asociadas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    type: [User],
    schema: {
      example: [
        {
          id: 1,
          firstName: 'María',
          lastName: 'González',
          email: 'maria.gonzalez@example.com',
          phone: '+541112345678',
          createdAt: '2026-05-20T10:00:00.000Z',
          updatedAt: '2026-05-20T10:00:00.000Z',
          cards: [
            {
              id: 2,
              userId: 1,
              cardNumber: '4111111111111111',
              cardHolder: 'María González',
              expirationMonth: '12',
              expirationYear: '2028',
              cvv: '123',
              brand: 'Visa',
              lastFour: '1111',
              isActive: true,
              createdAt: '2026-05-20T10:01:00.000Z',
              updatedAt: '2026-05-20T10:01:00.000Z',
            },
          ],
          payments: [],
        },
      ],
    },
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Retorna un usuario específico incluyendo tarjetas y pagos.',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: User,
    schema: {
      example: {
        id: 1,
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@example.com',
        phone: '+541112345678',
        createdAt: '2026-05-20T10:00:00.000Z',
        updatedAt: '2026-05-20T10:00:00.000Z',
        cards: [
          {
            id: 2,
            userId: 1,
            cardNumber: '4111111111111111',
            cardHolder: 'María González',
            expirationMonth: '12',
            expirationYear: '2028',
            cvv: '123',
            brand: 'Visa',
            lastFour: '1111',
            isActive: true,
            createdAt: '2026-05-20T10:01:00.000Z',
            updatedAt: '2026-05-20T10:01:00.000Z',
          },
        ],
        payments: [],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario y sus datos asociados en cascada.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a eliminar',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
