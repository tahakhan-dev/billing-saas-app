// src/modules/invoice/dto/update-invoice.dto.ts

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { CreateInvoiceDto } from './create-invoice.dto';
import { InvoiceStatus } from 'src/common/enums/generic.enum';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ example: 100.50, description: 'New amount of the invoice' })
    amount?: number;

    @IsOptional()
    @IsDateString()
    @ApiPropertyOptional({ example: '2024-10-30T14:48:00.000Z', description: 'New due date of the invoice' })
    dueDate?: Date;

    @IsOptional()
    @ApiPropertyOptional({ enum: InvoiceStatus, description: 'New status of the invoice' })
    @IsEnum(InvoiceStatus)
    status: InvoiceStatus;
}
