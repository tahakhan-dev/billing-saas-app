import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from '../invoice/entities/invoice.entity';
import { PaymentEntity } from './entities/payment.entity';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity, InvoiceEntity, CustomerEntity])
  ],
  controllers: [PaymentController],
  providers: [PaymentService,EmailService],
})
export class PaymentModule { }
