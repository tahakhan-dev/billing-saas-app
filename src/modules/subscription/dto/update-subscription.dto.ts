// src/modules/subscription/dto/update-subscription-plan.dto.ts

import { PartialType, ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDecimal, IsInt, IsString, MaxLength, IsEnum, IsNumber } from 'class-validator';
import { CreateSubscriptionPlanDto } from './create-subscription.dto';
import { SubscriptionPlanStatus } from 'src/common/enums/generic.enum';

export class UpdateSubscriptionPlanDto extends PartialType(CreateSubscriptionPlanDto) {
    @ApiPropertyOptional({ description: 'Name of the subscription plan', example: 'Premium Plan' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @ApiPropertyOptional({ description: 'Price of the subscription plan', example: 15.00 })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiPropertyOptional({ description: 'Duration of the subscription plan in days', example: 45 })
    @IsOptional()
    @IsInt()
    duration?: number;

    @ApiPropertyOptional({ description: 'Features included in the plan', example: 'Access to premium features' })
    @IsOptional()
    @IsString()
    features?: string;

    @ApiProperty({ example: 'active', enum: SubscriptionPlanStatus, description: 'Status of the subscription plan' })
    @IsOptional()
    @IsEnum(SubscriptionPlanStatus)
    status: SubscriptionPlanStatus;
}
