import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';
import { InvoiceEntity } from '../invoice/entities/invoice.entity';
import { CustomerEntity } from './entities/customer.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([CustomerEntity, SubscriptionPlanEntity, InvoiceEntity])
  ],
  controllers: [CustomerController],
  providers: [JwtService,
    CustomerService],
})
export class CustomerModule { }
