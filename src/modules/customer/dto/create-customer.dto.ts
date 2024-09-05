import { IsEmail, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({ description: 'Name of the customer', example: 'John Doe' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Email address of the customer', example: 'johndoe@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Subscription Plan ID', example: 1, required: true })
    @IsNotEmpty()
    @IsNumber()
    subscriptionPlanId: number;

    @ApiProperty({ description: 'Current status of the subscription', example: 'active', required: false })
    @IsOptional()
    subscription_status?: string;

    @ApiProperty({ description: 'Date of the last payment', example: '2024-09-01', required: false })
    @IsOptional()
    last_payment_date?: Date;
}
