import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from '../invoice/entities/invoice.entity';
import { PaymentEntity } from './entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity, InvoiceEntity])
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
