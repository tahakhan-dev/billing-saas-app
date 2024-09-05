import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceEntity } from '../invoice/entities/invoice.entity';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(PaymentEntity) private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(InvoiceEntity) private readonly invoiceRepository: Repository<InvoiceEntity>,

  ) { }

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    const { invoiceId, ...paymentDetails } = createPaymentDto;

    // Check if the invoice exists
    const existingInvoice = await this.invoiceRepository.findOne({ where: { id: invoiceId }, relations: ['payments'] });
    if (!existingInvoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found.`);
    }

    console.log(existingInvoice, '====existingInvoice=======');


    // Create the payment record
    const payment = this.paymentRepository.create({ invoice: existingInvoice, ...paymentDetails });
    console.log(payment, '====payment===========');

    await this.paymentRepository.save(payment);

    // Calculate the total amount paid for the invoice
    const totalPayments = existingInvoice.payments.reduce((sum, p) => sum + p.amount, 0) + payment.amount;

    // Update the invoice status if fully paid
    if (totalPayments >= existingInvoice.amount) {
      existingInvoice.status = 'paid';
      await this.invoiceRepository.update({ id: existingInvoice.id }, { status: 'paid', paymentDate: new Date() });
    } else {
      // update the paymentDate
      await this.invoiceRepository.update({ id: existingInvoice.id }, { paymentDate: new Date() });
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

        // Update invoice status if fully paid
        const totalPayments = payment.invoice.payments.reduce((sum, p) => sum + p.amount, 0) + payment.amount;
        if (totalPayments >= payment.invoice.amount) {
          payment.invoice.status = 'paid';
          await this.invoiceRepository.save(payment.invoice);
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
    return await this.paymentRepository.find({
      relations: ['invoice'] // If you want to fetch related invoice details
    });
  }

  async findById(id: number): Promise<PaymentEntity | undefined> {
    return await this.paymentRepository.findOne({ where: { id }, relations: ['invoice'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<PaymentEntity | null> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      return null;
    }
    this.paymentRepository.merge(payment, updatePaymentDto);
    await this.paymentRepository.save(payment);
    return payment;
  }
  async delete(id: number): Promise<boolean> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      return false;
    }
    await this.paymentRepository.remove(payment);
    return true;
  }
}
