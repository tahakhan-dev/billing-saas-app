import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity,SubscriptionPlanEntity])
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule { }
