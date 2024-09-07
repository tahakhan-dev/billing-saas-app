import { PaymentSuccessfulEvent } from 'src/email/events/payment-successful.event';
import { PaymentFailedEvent } from 'src/email/events/payment-failed.event';
import { InvoiceEntity } from '../invoice/entities/invoice.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(PaymentEntity) private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(InvoiceEntity) private readonly invoiceRepository: Repository<InvoiceEntity>,
    private readonly eventEmitter: EventEmitter2, // Inject EventEmitter
  ) { }

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {

    const { invoiceId, ...paymentDetails } = createPaymentDto;

    // Check if the invoice exists
    const existingInvoice = await this.invoiceRepository.findOne({ where: { id: invoiceId }, relations: ['payments'] });
    if (!existingInvoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found.`);
    }

    // Create the payment record
    const payment = this.paymentRepository.create({ invoice: existingInvoice, ...paymentDetails });
    const savedPayment = await this.paymentRepository.save(payment);

    // Calculate the total amount paid for the invoice
    const totalPayments = existingInvoice?.payments?.reduce((sum, p) => sum + p?.amount, 0) + payment?.amount;

    // Update the invoice status if fully paid
    if (totalPayments >= existingInvoice?.amount) {
      existingInvoice.status = 'paid';
      await this.invoiceRepository.update({ id: existingInvoice?.id }, { status: 'paid', paymentDate: new Date() });

      // Emit an event for successful payment
      this.eventEmitter.emit(
        'payment.successful',
        new PaymentSuccessfulEvent(existingInvoice?.customer?.email, savedPayment?.id, existingInvoice?.id, payment?.amount),
      );
    }
    return payment;
  }

  // Method to handle payment failure and retry
  async handleFailedPayment(paymentId: number): Promise<PaymentEntity> {

    const payment = await this.paymentRepository.findOne({ where: { id: paymentId }, relations: ['invoice'] });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found.`);
    }

    // Mark payment as failed
    payment.status = 'failed';
    await this.paymentRepository.save(payment);

    try {
      // Emit an event for failed payment
      this.eventEmitter.emit(
        'payment.failed',
        new PaymentFailedEvent(payment?.invoice?.customer?.email, payment?.id, payment?.invoice?.id, payment?.amount),
      );
    } catch (error) {
      console.error('Failed to emit event:', error);
    }

    // Retry logic
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        // Simulate retry logic (e.g., calling payment gateway again)
        // Assuming some external service handles the payment processing

        // If retry is successful, update status and return
        payment.status = 'paid';
        await this.paymentRepository.save(payment);

        // Emit an event for failed payment
        this.eventEmitter.emit(
          'payment.failed',
          new PaymentFailedEvent(payment?.invoice?.customer?.email, payment?.id, payment?.invoice?.id, payment?.amount),
        );
        // Update invoice status if fully paid
        const totalPayments = payment?.invoice?.payments?.reduce((sum, p) => sum + p?.amount, 0) + payment?.amount;
        if (totalPayments >= payment?.invoice?.amount) {
          payment.invoice.status = 'paid';
          await this.invoiceRepository.save(payment?.invoice);
        }
        return payment;
      } catch (error) {
        retryCount++;
      }
    }

    // If all retries fail, log the failure and return the failed payment
    payment.status = 'failed_permanently';
    await this.paymentRepository.save(payment);
    return payment;
  }

  async findAll(): Promise<PaymentEntity[]> {
    try {
      return await this.paymentRepository.find({
        relations: ['invoice'] // If you want to fetch related invoice details
      });
    } catch (error) {
      console.error(error);
    }
  }

  async findById(id: number): Promise<PaymentEntity | undefined> {
    try {
      return await this.paymentRepository.findOne({ where: { id }, relations: ['invoice'] });
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<PaymentEntity | null> {
    try {
      const payment = await this.paymentRepository.findOne({ where: { id } });
      if (!payment) {
        return null;
      }
      this.paymentRepository.merge(payment, updatePaymentDto);
      await this.paymentRepository.save(payment);
      return payment;
    } catch (error) {
      console.error(error);
    }
  }
  async delete(id: number): Promise<boolean> {
    try {
      const payment = await this.paymentRepository.findOne({ where: { id } });
      if (!payment) {
        return false;
      }
      await this.paymentRepository.remove(payment);
      return true;
    } catch (error) {
      console.error(error);
    }
  }
}
