import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Factory de configuración de TypeORM.
 * Usa DATABASE_URL (formato postgres://) para conexión unificada.
 * Soporta SSL en producción y logging en desarrollo.
 */
export const DatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isDev = configService.get('NODE_ENV') === 'development';

  return {
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    autoLoadEntities: true,
    synchronize: false,
    logging: isDev,
    ssl: isDev ? false : { rejectUnauthorized: false },
  };
};
