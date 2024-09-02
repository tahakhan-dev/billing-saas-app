import { IsNumberString, IsNotEmpty, IsNumber } from 'class-validator';

export class BaseDto {
    @IsNotEmpty()
    @IsNumber()
    consumerId: number;

}
