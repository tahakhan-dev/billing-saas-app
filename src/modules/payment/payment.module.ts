import { CustomerEntity } from '../customer/entities/customer.entity';
import { InvoiceEntity } from '../invoice/entities/invoice.entity';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { EmailService } from 'src/email/email.service';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity, InvoiceEntity, CustomerEntity])
  ],
  controllers: [PaymentController],
  providers: [PaymentService,EmailService],
})
export class PaymentModule { }
