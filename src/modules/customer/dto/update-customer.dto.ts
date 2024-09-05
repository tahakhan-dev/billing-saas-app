import { IsOptional, IsDateString, IsNumber } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

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
