import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { InvoiceController } from './invoice.controller';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceService } from './invoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceEntity, CustomerEntity, SubscriptionPlanEntity])
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule { }
