import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, NotFoundException, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionPlanEntity } from './entities/subscription-plan.entity';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription.dto';
import { CreateSubscriptionPlanDto } from './dto/create-subscription.dto';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';

@ApiTags('Subscription Plans')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new subscription plan' })
  @ApiResponse({ status: 201, description: 'Subscription plan created successfully.' })
  @ApiResponse({ status: 409, description: 'Subscription plan already exists.' })
  async createSubscriptionPlan(@Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    const plan = await this.subscriptionService.create(createSubscriptionPlanDto);
    return plan;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all subscription plans' })
  @ApiResponse({ status: 200, description: 'Returned all subscription plans successfully', type: [SubscriptionPlanEntity] })
  async getAllSubscriptionPlans(): Promise<SubscriptionPlanEntity[]> {
    return await this.subscriptionService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific subscription plan by ID' })
  @ApiResponse({ status: 200, description: 'Subscription plan retrieved successfully', type: SubscriptionPlanEntity })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Subscription Plan ID' })
  async getSubscriptionPlanById(@Param('id') id: number): Promise<SubscriptionPlanEntity> {
    const plan = await this.subscriptionService.findById(id);
    if (!plan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found.`);
    }
    return plan;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a subscription plan' })
  @ApiResponse({ status: 200, description: 'Subscription plan updated successfully.' })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Subscription Plan ID' })
  async updateSubscriptionPlan(@Param('id') id: number, @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto) {
    const updatedPlan = await this.subscriptionService.update(id, updateSubscriptionPlanDto);
    if (!updatedPlan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found.`);
    }
    return updatedPlan;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a subscription plan' })
  @ApiResponse({ status: 204, description: 'Subscription plan deleted successfully' })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Subscription Plan ID' })
  async deleteSubscriptionPlan(@Param('id') id: number) {
    const result = await this.subscriptionService.delete(id);
    if (!result) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found.`);
    }
  }
}
