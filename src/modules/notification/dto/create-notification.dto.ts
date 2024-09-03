// src/modules/notification/dto/create-notification.dto.ts

import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from 'src/common/enums/generic.enum';



export class CreateNotificationDto {
    @ApiProperty({ example: 1, description: 'ID of the customer associated with the notification' })
    @IsNotEmpty()
    @IsNumber()
    customerId: number;

    @ApiProperty({ example: 'Email', enum: NotificationType, description: 'Type of the notification' })
    @IsEnum(NotificationType)
    type: NotificationType;

    @ApiProperty({ example: 1, description: 'Reference ID (e.g., invoice or payment ID)' })
    @IsNotEmpty()
    @IsNumber()
    referenceId: number;

    @ApiProperty({ example: 'Your payment has been processed successfully.', description: 'Message content of the notification' })
    @IsNotEmpty()
    @IsString()
    message: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Failed to send due to network error', description: 'Error message if the notification fails', required: false })
    errorMessage?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Sent', description: 'Status of the notification', required: false })
    status?: string;
}
