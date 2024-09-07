import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';
import { InvoiceCreatedEvent } from 'src/email/events/invoice-created.event';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceEntity } from './entities/invoice.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceService {

  constructor(
    @InjectRepository(InvoiceEntity) private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(CustomerEntity) private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(SubscriptionPlanEntity) private readonly subscriptionPlanRepository: Repository<SubscriptionPlanEntity>,
    private readonly eventEmitter: EventEmitter2, // Inject EventEmitter

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

    const newInvoice = this.invoiceRepository.create({
      ...invoiceDetails,
      customer: existingCustomer,
      subscriptionPlan: subscriptionPlan
    });

    const savedInvoice = await this.invoiceRepository.save(newInvoice);

    // Send email notification
    // Emit an event for the new invoice
    this.eventEmitter.emit(
      'invoice.created',
      new InvoiceCreatedEvent(existingCustomer.email, savedInvoice.id, savedInvoice.amount),
    );

    return savedInvoice;
  }

  async findAll(): Promise<InvoiceEntity[]> {
    try {
      return await this.invoiceRepository.find({
        relations: ['customer', 'subscriptionPlan'] // Assuming relations if needed
      });
    } catch (error) {
      console.error(error);
    }

  }


  async findById(id: number): Promise<InvoiceEntity | undefined> {
    try {
      return await this.invoiceRepository.findOne({
        where: { id },
        relations: ['customer', 'subscriptionPlan']  // Assuming relations are needed
      });
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<InvoiceEntity | null> {
    try {
      const invoice = await this.invoiceRepository.findOne({ where: { id } });
      if (!invoice) {
        return null;
      }
      this.invoiceRepository.merge(invoice, updateInvoiceDto);
      await this.invoiceRepository.save(invoice);
      return invoice;
    } catch (error) {
      console.error(error);
    }
  }


  async delete(id: number): Promise<boolean> {
    try {
      const invoice = await this.invoiceRepository.findOne({ where: { id } });
      if (!invoice) {
        return false;
      }
      await this.invoiceRepository.remove(invoice);
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  // Cron job to automatically generate invoices
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateInvoicesForDueCustomers() {
    try {
      const customers = await this.customerRepository.find({
        where: {
          subscriptionEndDate: new Date(), // Find customers whose subscription ends today
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

        const savedInvoice = await this.invoiceRepository.save(newInvoice);

        // Emit an event for the new invoice
        this.eventEmitter.emit(
          'invoice.created',
          new InvoiceCreatedEvent(customer.email, savedInvoice.id, savedInvoice.amount),
        );

        // Update customer's subscription end date for the next billing cycle
        const endDate = new Date();
        if (customer.subscriptionPlan.billingCycle === 'days') {
          endDate.setDate(endDate.getDate() + customer.subscriptionPlan.duration);
        } else if (customer.subscriptionPlan.billingCycle === 'months') {
          endDate.setMonth(endDate.getMonth() + customer.subscriptionPlan.duration);
        }
        customer.subscriptionEndDate = endDate;
        await this.customerRepository.save(customer);
      }
    } catch (error) {
      console.error(error);
    }
  }

}
