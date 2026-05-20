import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Información de la API',
    description:
      'Retorna un mensaje de bienvenida, versión y endpoints disponibles.',
  })
  @ApiResponse({
    status: 200,
    description: 'Información de la API',
    schema: {
      example: {
        message: 'Sistema de pagos API funcionando',
        version: '1.0.0',
        endpoints: [
          'GET /',
          'GET /health',
          'POST /users',
          'POST /cards',
          'POST /payments',
        ],
      },
    },
  })
  getHello(): { message: string; version: string; endpoints: string[] } {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Estado de salud',
    description: 'Retorna el estado de salud del servicio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Servicio saludable',
    schema: {
      example: {
        status: 'OK',
        timestamp: '2026-05-20T10:30:00.000Z',
      },
    },
  })
  getHealth(): { status: string; timestamp: string } {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }
}
