// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/common/constants';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { CustomerService } from '../customer/customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CustomerEntity, SubscriptionPlanEntity]),
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
