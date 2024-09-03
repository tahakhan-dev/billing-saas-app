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

    // Check if invoice exists or not 
    const existingInvoice = await this.invoiceRepository.findOne({ where: { id: invoiceId } });
    if (!existingInvoice) {
      throw new NotFoundException(`No invoice id exists`);
    }
    // Create the Payment with the resolved Invoice

    const payment = this.paymentRepository.create({ invoice: existingInvoice, ...paymentDetails });
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
