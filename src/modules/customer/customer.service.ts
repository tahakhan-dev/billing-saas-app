import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity) private readonly customerRepository: Repository<CustomerEntity>,
    private jwtService: JwtService,  // Inject the JwtService
    @InjectRepository(SubscriptionPlanEntity) private readonly subscriptionPlanRepository: Repository<SubscriptionPlanEntity>,

  ) { }
  async create(createCustomerDto: CreateCustomerDto): Promise<{ customer: CustomerEntity, accessToken: string }> {
    const { subscriptionPlanId, email, ...customerDetails } = createCustomerDto;

    // Check if customer with the same email already exists
    const existingCustomer = await this.customerRepository.findOne({ where: { email } });

    if (existingCustomer) {
      const payload = { email: existingCustomer.email, sub: existingCustomer.id };

      const accessToken = await this.jwtService.signAsync({ ...payload }, { secret: jwtConstants.secret });
      return { customer: existingCustomer, accessToken };
    }

    // Find the subscription plan
    const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { id: subscriptionPlanId } });
    if (!subscriptionPlan) {
      throw new NotFoundException(`Subscription Plan with ID ${subscriptionPlanId} not found`);
    }

    console.log(subscriptionPlan, '=====subscriptionPlan========');


    // Create the customer with the resolved subscription plan
    const customer = this.customerRepository.create({
      ...customerDetails,
      email, // Ensure email is included in the spread operation
      subscriptionPlan: subscriptionPlan  // Assigning the entity, not the ID
    });

    const savedCustomer = await this.customerRepository.save(customer);
    // Generate JWT token for the newly created customer
    const payload = { email: savedCustomer.email, sub: savedCustomer.id };

    const accessToken = await this.jwtService.signAsync({ ...payload }, { secret: jwtConstants.secret });

    // Return both the customer details and the JWT token
    return { customer: customer, accessToken };

  }

  async findAll(): Promise<CustomerEntity[]> {
    // This will naturally return an empty array if no customers are found
    return await this.customerRepository.find({
      relations: ['subscriptionPlan']
    });
  }

  async findById(id: number): Promise<CustomerEntity> {
    return await this.customerRepository.findOne({ where: { id }, relations: ['subscriptionPlan'] });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }

    if (updateCustomerDto.subscriptionPlanId) {
      const newPlan = await this.subscriptionPlanRepository.findOne({ where: { id: updateCustomerDto.subscriptionPlanId } });
      if (!newPlan) {
        throw new NotFoundException(`Subscription Plan with ID ${updateCustomerDto.subscriptionPlanId} not found.`);
      }
      customer.subscriptionPlan = newPlan; // Assign the new subscription plan
    }

    this.customerRepository.merge(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async delete(id: number): Promise<boolean> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      return false;
    }
    await this.customerRepository.remove(customer);
    return true;
  }

  async findOne(email: string): Promise<CustomerEntity | undefined> {
    return this.customerRepository.findOne({ where: { email } });
  }

  async validateCustomer(email: string): Promise<any> {
    const customer = await this.findOne(email);
    if (customer) {
      const { ...result } = customer;
      return result;
    }
    return null;
  }
}
