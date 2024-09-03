// src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class AuthService {
    constructor(
        private customerService: CustomerService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string): Promise<any> {
        return this.customerService.validateCustomer(email);
    }

    async login(email: string) {
        const customer = await this.validateUser(email);
        if (!customer) {
            return null;
        }
        const payload = { email: customer.email, sub: customer.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
