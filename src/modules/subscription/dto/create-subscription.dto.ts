import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { SubscriptionPlanStatus } from "src/common/enums/generic.enum";

export class CreateSubscriptionPlanDto {
    @ApiProperty({ example: 'Basic Plan', description: 'Name of the subscription plan' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 10.00, description: 'Price of the subscription plan' })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ example: 30, description: 'Duration of the subscription plan in days' })
    @IsNotEmpty()
    duration: number;

    @ApiProperty({ example: 'Access to basic features', description: 'Features included in the plan' })
    @IsNotEmpty()
    @IsString()
    features: string;

    @ApiProperty({ example: 'active', enum: SubscriptionPlanStatus, description: 'Status of the subscription plan' })
    @IsEnum(SubscriptionPlanStatus)
    status: SubscriptionPlanStatus;
}