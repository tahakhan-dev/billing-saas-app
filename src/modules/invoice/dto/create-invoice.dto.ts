// src/modules/invoice/dto/create-invoice.dto.ts

import { IsNotEmpty, IsNumber, IsDate, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from 'src/common/enums/generic.enum';

export class CreateInvoiceDto {
    @ApiProperty({ example: 1, description: 'Customer ID associated with the invoice' })
    @IsNotEmpty()
    @IsNumber()
    customerId: number;

    @ApiProperty({ example: 1, description: 'Subscription Plan ID associated with the invoice' })
    @IsNotEmpty()
    @IsNumber()
    subscriptionPlanId: number;

    @ApiProperty({ example: 100.00, description: 'Total amount of the invoice' })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({ example: '2024-09-30T14:48:00.000Z', description: 'Issue date of the invoice' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    issueDate: Date;

    @ApiProperty({ example: '2024-09-30T14:48:00.000Z', description: 'Payment date of the invoice' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    paymentDate: Date;

    @ApiProperty({ example: '2024-10-30T14:48:00.000Z', description: 'Due date of the invoice' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    dueDate: Date;

    @ApiProperty({ enum: InvoiceStatus, description: 'Current status of the invoice' })
    @IsEnum(InvoiceStatus)
    status: InvoiceStatus;
}
