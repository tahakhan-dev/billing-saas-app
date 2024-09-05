import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';
import { InvoiceEntity } from '../invoice/entities/invoice.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { jwtConstants } from 'src/common/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity) private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(SubscriptionPlanEntity) private readonly subscriptionPlanRepository: Repository<SubscriptionPlanEntity>,
    @InjectRepository(InvoiceEntity) private readonly invoiceRepository: Repository<InvoiceEntity>,
    private jwtService: JwtService,  // Inject the JwtService


  ) { }

  async assignSubscriptionPlan(customerId: number, subscriptionPlanId: number): Promise<CustomerEntity> {
    try {

      const customer = await this.customerRepository.findOne({ where: { id: customerId }, relations: ['subscriptionPlan'] });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} not found.`);
      }

      const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { id: subscriptionPlanId } });
      if (!subscriptionPlan) {
        throw new NotFoundException(`Subscription plan with ID ${subscriptionPlanId} not found.`);
      }

      customer.subscriptionPlan = subscriptionPlan;
      customer.subscription_status = 'active';
      customer.subscription_start_date = new Date();

      // Calculate subscription end date based on the plan's duration and billing cycle
      const endDate = new Date();
      if (subscriptionPlan?.billingCycle === 'days') {
        endDate.setDate(endDate?.getDate() + subscriptionPlan?.duration);
      } else if (subscriptionPlan.billingCycle === 'months') {
        endDate.setMonth(endDate?.getMonth() + subscriptionPlan?.duration);
      }

      customer.subscription_end_date = endDate;
      return this.customerRepository.save(customer);
    } catch (error) {
      console.error(error);
    }
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<{ customer: CustomerEntity, accessToken: string }> {
    try {
      const { subscriptionPlanId, email, ...customerDetails } = createCustomerDto;

      // Check if customer with the same email already exists
      const existingCustomer = await this.customerRepository.findOne({ where: { email } });

      if (existingCustomer) {
        const payload = { email: existingCustomer?.email, sub: existingCustomer?.id };
        const accessToken = await this.jwtService.signAsync({ ...payload }, { secret: jwtConstants?.secret });
        return { customer: existingCustomer, accessToken };
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
        subscriptionPlan: subscriptionPlan,
        subscription_status: 'active',
        subscription_start_date: new Date(),
      });

      // Calculate subscription end date based on the plan's duration and billing cycle
      const endDate = new Date();
      if (subscriptionPlan?.billingCycle === 'days') {
        endDate.setDate(endDate?.getDate() + subscriptionPlan?.duration);
      } else if (subscriptionPlan?.billingCycle === 'months') {
        endDate.setMonth(endDate?.getMonth() + subscriptionPlan?.duration);
      }
      customer.subscription_end_date = endDate;

      const savedCustomer = await this.customerRepository.save(customer);
      // Generate JWT token for the newly created customer
      const payload = { email: savedCustomer?.email, sub: savedCustomer?.id };

      const accessToken = await this.jwtService.signAsync({ ...payload }, { secret: jwtConstants?.secret });

      // Return both the customer details and the JWT token
      return { customer: savedCustomer, accessToken };
    } catch (error) {
      console.error(error);
    }
  }

  async findAll(): Promise<CustomerEntity[]> {
    // This will naturally return an empty array if no customers are found

    try {
      return await this.customerRepository.find({
        relations: ['subscriptionPlan']
      });
    } catch (error) {
      console.error(error);
    }
  }

  async findById(id: number): Promise<CustomerEntity> {
    try {
      return await this.customerRepository.findOne({ where: { id }, relations: ['subscriptionPlan'] });
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<CustomerEntity> {

    try {
      const customer = await this.customerRepository.findOne({ where: { id }, relations: ['subscriptionPlan'] });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found.`);
      }

      if (updateCustomerDto?.subscriptionPlanId) {
        const newPlan = await this.subscriptionPlanRepository.findOne({ where: { id: updateCustomerDto?.subscriptionPlanId } });
        if (!newPlan) {
          throw new NotFoundException(`Subscription Plan with ID ${updateCustomerDto?.subscriptionPlanId} not found.`);
        }

        // Calculate days remaining in the current cycle
        const today = new Date();
        const daysRemaining = Math.ceil((customer?.subscription_end_date?.getTime() - today?.getTime()) / (1000 * 3600 * 24));

        // Calculate prorated amount for the current plan
        const dailyRateOldPlan = customer?.subscriptionPlan?.price / customer?.subscriptionPlan?.duration;
        const proratedAmountOldPlan = dailyRateOldPlan * daysRemaining;

        // Create an invoice for the old plan prorated amount
        const oldPlanInvoice = this.invoiceRepository.create({
          customer: customer,
          subscriptionPlan: customer?.subscriptionPlan,
          amount: proratedAmountOldPlan,
          issueDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // assuming 30-day payment terms
          status: 'pending',
        });
        await this.invoiceRepository.save(oldPlanInvoice);

        // Assign the new plan to the customer
        customer.subscriptionPlan = newPlan;

        // Calculate new subscription end date
        const newEndDate = new Date();
        if (newPlan?.billingCycle === 'days') {
          newEndDate.setDate(newEndDate?.getDate() + newPlan?.duration);
        } else if (newPlan?.billingCycle === 'months') {
          newEndDate.setMonth(newEndDate?.getMonth() + newPlan?.duration);
        }
        customer.subscription_end_date = newEndDate;

        // Calculate the prorated amount for the new plan
        const dailyRateNewPlan = newPlan?.price / newPlan?.duration;
        const proratedAmountNewPlan = dailyRateNewPlan * (newPlan?.duration - daysRemaining);

        // Create an invoice for the new plan prorated amount
        const newPlanInvoice = this.invoiceRepository.create({
          customer: customer,
          subscriptionPlan: newPlan,
          amount: proratedAmountNewPlan,
          issueDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // assuming 30-day payment terms
          status: 'pending',
        });
        await this.invoiceRepository.save(newPlanInvoice);
      }

      this.customerRepository.merge(customer, updateCustomerDto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      console.error(error);
    }

  }

  async delete(id: number): Promise<boolean> {
    try {
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) {
        return false;
      }
      await this.customerRepository.remove(customer);
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(email: string): Promise<CustomerEntity | undefined> {
    try {
      return this.customerRepository.findOne({ where: { email } });
    } catch (error) {
      console.error(error);
    }
  }

  async validateCustomer(email: string): Promise<any> {
    try {
      const customer = await this.findOne(email);
      if (customer) {
        const { ...result } = customer;
        return result;
      }
      return null;
    } catch (error) {
      console.error(error);
    }
  }
}
