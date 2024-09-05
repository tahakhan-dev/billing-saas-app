import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class InvoiceService {

  constructor(
    @InjectRepository(InvoiceEntity) private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(CustomerEntity) private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(SubscriptionPlanEntity) private readonly subscriptionPlanRepository: Repository<SubscriptionPlanEntity>,
  ) { }



  async create(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceEntity> {
    const { subscriptionPlanId, customerId, ...invoiceDetails } = createInvoiceDto;

    // Check if customer with the same email already exists
    const existingCustomer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!existingCustomer) {
      throw new NotFoundException(`This Customer Does not Exists.`);
    }

    // Find the subscription plan
    const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { id: subscriptionPlanId } });
    if (!subscriptionPlan) {
      throw new NotFoundException(`Subscription Plan with ID ${subscriptionPlanId} not found`);
    }

    // Create the customer with the  resolved invoice 

    const customer = this.invoiceRepository.create({
      ...invoiceDetails,
      customer: existingCustomer,
      subscriptionPlan: subscriptionPlan
    });

    return await this.invoiceRepository.save(customer);
  }

  async findAll(): Promise<InvoiceEntity[]> {
    return await this.invoiceRepository.find({
      relations: ['customer', 'subscriptionPlan'] // Assuming relations if needed
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  async findById(id: number): Promise<InvoiceEntity | undefined> {
    return await this.invoiceRepository.findOne({
      where: { id },
      relations: ['customer', 'subscriptionPlan']  // Assuming relations are needed
    });
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<InvoiceEntity | null> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      return null;
    }
    this.invoiceRepository.merge(invoice, updateInvoiceDto);
    await this.invoiceRepository.save(invoice);
    return invoice;
  }


  async delete(id: number): Promise<boolean> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      return false;
    }
    await this.invoiceRepository.remove(invoice);
    return true;
  }

  // Cron job to automatically generate invoices
  @Cron(CronExpression.EVERY_10_SECONDS)
  async generateInvoicesForDueCustomers() {
    const customers = await this.customerRepository.find({
      where: {
        subscription_end_date: new Date(), // Find customers whose subscription ends today
      },
      relations: ['subscriptionPlan'],
    });

    for (const customer of customers) {
      const newInvoice = this.invoiceRepository.create({
        customer: customer,
        subscriptionPlan: customer.subscriptionPlan,
        amount: customer.subscriptionPlan.price,
        issueDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // assuming 30-day payment terms
        status: 'pending',
      });

      await this.invoiceRepository.save(newInvoice);

      // Update customer's subscription end date for the next billing cycle
      const endDate = new Date();
      if (customer.subscriptionPlan.billingCycle === 'days') {
        endDate.setDate(endDate.getDate() + customer.subscriptionPlan.duration);
      } else if (customer.subscriptionPlan.billingCycle === 'months') {
        endDate.setMonth(endDate.getMonth() + customer.subscriptionPlan.duration);
      }
      customer.subscription_end_date = endDate;
      await this.customerRepository.save(customer);
    }
  }

}
