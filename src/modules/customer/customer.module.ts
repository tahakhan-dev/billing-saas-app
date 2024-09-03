import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([CustomerEntity,SubscriptionPlanEntity])
  ],
  controllers: [CustomerController],
  providers: [JwtService,
    CustomerService],
})
export class CustomerModule { }
