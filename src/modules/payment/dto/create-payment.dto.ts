import { IsNotEmpty, IsNumber, IsDate, IsEnum } from 'class-validator';
import { PaymentStatus } from 'src/common/enums/generic.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
    @ApiProperty({ example: 1, description: 'ID of the invoice this payment is for' })
    @IsNotEmpty()
    @IsNumber()
    invoiceId: number;

    @ApiProperty({ example: 100.00, description: 'Amount of the payment' })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({ example: '2024-10-01T14:48:00.000Z', description: 'Date of the payment' })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    paymentDate: Date;


    @ApiProperty({ example: 'credit_card', description: 'Method of payment' })
    @IsNotEmpty()
    paymentMethod: string;

    @ApiProperty({ enum: PaymentStatus, description: 'Status of the payment' })
    @IsEnum(PaymentStatus)
    status: PaymentStatus;
}
