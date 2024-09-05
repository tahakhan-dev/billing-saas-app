import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, Put, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerEntity } from './entities/customer.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';

@ApiTags('Customers')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 409, description: 'Cutomer Already Exists.' })

  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const { customer, accessToken } = await this.customerService.create(createCustomerDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Customer created successfully',
      data: {
        customer,
        accessToken,  // Include the token in the response
      },
    };
  }

  @ApiBearerAuth()
  @Put('/:id/assign-subscription/:subscriptionPlanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a subscription plan to a customer' })
  @ApiResponse({ status: 200, description: 'Subscription plan assigned successfully' })
  @ApiResponse({ status: 404, description: 'Customer or subscription plan not found' })
  @ApiParam({ name: 'id', type: String, description: 'Customer ID' })
  async assignSubscription(
    @Param('id') id: number,
    @Param('subscriptionPlanId') subscriptionPlanId: number,
  ) {
    const updatedCustomer = await this.customerService.assignSubscriptionPlan(id, subscriptionPlanId);
    return updatedCustomer;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all customers' })
  @ApiResponse({ status: 200, description: 'Returned all customers successfully, might be empty if no customers are found', type: [CustomerEntity] })
  async getAllCustomers(): Promise<CustomerEntity[]> {
    return await this.customerService.findAll();
  }


  @ApiBearerAuth()
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully', type: CustomerEntity })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiParam({ name: 'id', type: String, description: 'Customer ID' })
  async getCustomerById(@Param('id') id: number): Promise<CustomerEntity> {
    const customer = await this.customerService.findById(id);
    console.log(customer, '====customer======');

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }
    return customer;
  }


  @ApiBearerAuth()
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update customer information' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiParam({ name: 'id', type: String, description: 'Customer ID' })
  async updateCustomer(@Param('id') id: number, @Body() updateCustomerDto: UpdateCustomerDto) {
    const updatedCustomer = await this.customerService.update(id, updateCustomerDto);
    if (!updatedCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }
    return updatedCustomer;
  }


  @ApiBearerAuth()
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiParam({ name: 'id', type: String, description: 'Customer ID' })
  async deleteCustomer(@Param('id') id: number) {
    const result = await this.customerService.delete(id);
    if (!result) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }
  }
}
