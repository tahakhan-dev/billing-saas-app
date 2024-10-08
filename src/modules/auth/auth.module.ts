// src/auth/auth.module.ts

import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { InvoiceEntity } from '../invoice/entities/invoice.entity';
import { CustomerService } from '../customer/customer.service';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/common/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([CustomerEntity, SubscriptionPlanEntity,InvoiceEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),  // Ensure PassportModule is configured
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60m' }, // Set an appropriate expiry for tokens
        }),
    ],
    providers: [AuthService, JwtStrategy, CustomerService],
    exports: [AuthService],
})
export class AuthModule { }
