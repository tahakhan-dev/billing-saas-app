import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity) private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(SubscriptionPlanEntity) private readonly subscriptionPlanRepository: Repository<SubscriptionPlanEntity>,

  ) { }
  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const { subscriptionPlanId, email, ...customerDetails } = createCustomerDto;

    // Check if customer with the same email already exists
    const existingCustomer = await this.customerRepository.findOne({ where: { email } });
    if (existingCustomer) {
      throw new ConflictException(`A customer with the email ${email} already exists.`);
    }

    // Find the subscription plan
    const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { id: subscriptionPlanId } });
    if (!subscriptionPlan) {
      throw new NotFoundException(`Subscription Plan with ID ${subscriptionPlanId} not found`);
    }

    // Create the customer with the resolved subscription plan
    const customer = this.customerRepository.create({
      ...customerDetails,
      email, // Ensure email is included in the spread operation
      subscriptionPlan: subscriptionPlan  // Assigning the entity, not the ID
    });

    return await this.customerRepository.save(customer);
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
}
