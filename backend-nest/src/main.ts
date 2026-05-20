import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ============================================
  // SWAGGER / OPENAPI DOCUMENTATION
  // ============================================
  const config = new DocumentBuilder()
    .setTitle('Sistema de Pagos API')
    .setDescription(
      'API REST para gestion de usuarios, tarjetas y procesamiento de pagos. Backend NestJS + PostgreSQL + Python Service.',
    )
    .setVersion('1.0.0')
    .addTag('Usuarios', 'Gestion de usuarios del sistema')
    .addTag('Tarjetas', 'Registro y gestion de tarjetas de credito')
    .addTag('Pagos', 'Creacion e historial de pagos')
    .addTag('Health', 'Estado de los servicios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ============================================
  // PREFIJO GLOBAL Y CORS
  // ============================================
  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`API corriendo en http://localhost:${port}/api`);
}
bootstrap();
