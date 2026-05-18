import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { UsersModule } from '../users/users.module';
import { CardsModule } from '../cards/cards.module';
import { PythonServiceClient } from '../common/python-service.clients';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    UsersModule,
    CardsModule,
    HttpModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PythonServiceClient],
  exports: [PaymentsService],
})
export class PaymentsModule {}
