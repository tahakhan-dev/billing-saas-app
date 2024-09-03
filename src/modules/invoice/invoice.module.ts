import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceEntity } from './entities/invoice.entity';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceEntity,CustomerEntity,SubscriptionPlanEntity])
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule { }
