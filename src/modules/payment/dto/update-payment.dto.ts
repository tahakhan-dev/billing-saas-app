import { IsOptional, IsNumber, IsEnum, IsDate } from 'class-validator';
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from 'src/common/enums/generic.enum';
import { CreatePaymentDto } from './create-payment.dto';
import { Type } from 'class-transformer';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ example: 120.00, description: 'Updated amount of the payment' })
    amount?: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ApiPropertyOptional({ example: '2024-11-01T14:48:00.000Z', description: 'Updated payment date' })
    paymentDate?: Date;

    @IsOptional()
    @ApiPropertyOptional({ enum: PaymentStatus, description: 'Updated status of the payment' })
    @IsEnum(PaymentStatus)
    status: PaymentStatus;
}
