import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; version: string; endpoints: string[] } {
    return {
      message: 'Hello World!',
      version: '1.0.0',
      endpoints: ['/api/users', '/api/cards', '/api/payments'],
    };
  }
}
