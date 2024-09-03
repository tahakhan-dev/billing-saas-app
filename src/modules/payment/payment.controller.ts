import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentEntity } from './entities/payment.entity';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a new payment' })
  @ApiResponse({ status: 201, description: 'Payment recorded successfully.' })
  public async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.create(createPaymentDto);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all payments' })
  @ApiResponse({ status: 200, description: 'Returned all payments successfully', type: [PaymentEntity] })
  async getAllPayments(): Promise<PaymentEntity[]> {
    return await this.paymentService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully', type: PaymentEntity })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Payment ID' })
  async getPaymentById(@Param('id') id: number): Promise<PaymentEntity> {
    const payment = await this.paymentService.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found.`);
    }
    return payment;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update payment details' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully.' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Payment ID' })
  @ApiBody({ type: UpdatePaymentDto })
  async updatePayment(@Param('id') id: number, @Body() updatePaymentDto: UpdatePaymentDto) {
    const updatedPayment = await this.paymentService.update(id, updatePaymentDto);
    if (!updatedPayment) {
      throw new NotFoundException(`Payment with ID ${id} not found.`);
    }
    return updatedPayment;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a payment' })
  @ApiResponse({ status: 204, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Payment ID' })
  async deletePayment(@Param('id') id: number) {
    const result = await this.paymentService.delete(id);
    if (!result) {
      throw new NotFoundException(`Payment with ID ${id} not found.`);
    }
  }
}
