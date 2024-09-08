import { CustomerService } from '../customer/customer.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private customerService: CustomerService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string): Promise<any> {
        try {
            return this.customerService.validateCustomer(email);
        } catch (error) {
            console.error(error);
        }
    }

    async login(email: string) {
        try {
            const customer = await this.validateUser(email);
            if (!customer) {
                return null;
            }
            const payload = { email: customer?.email, sub: customer?.id };
            return {
                access_token: this.jwtService?.sign(payload),
            };
        } catch (error) {
            console.error(error);
        }
    }
}
