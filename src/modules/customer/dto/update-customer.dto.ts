// src/modules/customer/dto/update-customer.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsOptional, IsDateString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ example: 1, description: 'Subscription Plan ID' })
    subscriptionPlanId?: number;

    @IsOptional()
    @ApiPropertyOptional({ example: 'active', description: 'Subscription status' })
    subscription_status?: string;

    @IsOptional()
    @IsDateString()
    @ApiPropertyOptional({ example: '2024-09-01', description: 'Last payment date' })
    last_payment_date?: Date;
}
