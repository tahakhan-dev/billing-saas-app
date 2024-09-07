import { InvoiceEntity } from '../invoice/entities/invoice.entity';
import { PaymentStatus } from 'src/common/enums/generic.enum';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Repository } from 'typeorm';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<PaymentEntity>;
  let invoiceRepository: Repository<InvoiceEntity>;
  let eventEmitter: EventEmitter2;

  const mockPayment: PaymentEntity = {
    id: 1,
    amount: 100,
    paymentDate: new Date(),
    paymentMethod: 'credit_card',
    status: 'pending',
    invoice: {} as InvoiceEntity,
  };

  const mockInvoice: InvoiceEntity = {
    id: 1,
    amount: 100,
    issueDate: new Date(),
    dueDate: new Date(),
    paymentDate: null,
    status: 'pending',
    customer: null,
    subscriptionPlan: null,
    payments: [],
  };

  const mockPaymentRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockInvoiceRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: getRepositoryToken(PaymentEntity), useValue: mockPaymentRepository },
        { provide: getRepositoryToken(InvoiceEntity), useValue: mockInvoiceRepository },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<Repository<PaymentEntity>>(getRepositoryToken(PaymentEntity));
    invoiceRepository = module.get<Repository<InvoiceEntity>>(getRepositoryToken(InvoiceEntity));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment and emit successful event', async () => {
      mockInvoiceRepository.findOne.mockResolvedValue(mockInvoice);
      mockPaymentRepository.create.mockReturnValue(mockPayment);
      mockPaymentRepository.save.mockResolvedValue(mockPayment);
      mockInvoiceRepository.save.mockResolvedValue(mockInvoice);

      const createPaymentDto: CreatePaymentDto = {
        invoiceId: 1,
        amount: 100,
        paymentDate: new Date(),
        paymentMethod: 'credit_card',
        status: PaymentStatus.SUCCESS,
      };

      const result = await service.create(createPaymentDto);
      expect(result).toEqual(mockPayment);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'payment.successful',
        expect.any(Object),
      );
    });

    it('should throw NotFoundException if invoice is not found', async () => {
      mockInvoiceRepository.findOne.mockResolvedValue(null);

      const createPaymentDto: CreatePaymentDto = {
        invoiceId: 1,
        amount: 100,
        paymentDate: new Date(),
        paymentMethod: 'credit_card',
        status: PaymentStatus.SUCCESS,
      };

      await expect(service.create(createPaymentDto)).rejects.toThrow(
        new NotFoundException('Invoice with ID 1 not found.'),
      );
    });
  });

  describe('handleFailedPayment', () => {
    it('should handle a failed payment and retry', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);
      mockPaymentRepository.save.mockResolvedValue(mockPayment);

      const result = await service.handleFailedPayment(1);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepository.save).toHaveBeenCalledTimes(3);
    });

    it('should throw NotFoundException if payment is not found', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(null);

      await expect(service.handleFailedPayment(1)).rejects.toThrow(
        new NotFoundException('Payment with ID 1 not found.'),
      );
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      mockPaymentRepository.find.mockResolvedValue([mockPayment]);

      const result = await service.findAll();
      expect(result).toEqual([mockPayment]);
    });
  });

  describe('findById', () => {
    it('should return a payment by ID', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);

      const result = await service.findById(1);
      expect(result).toEqual(mockPayment);
    });

    it('should return undefined if payment not found', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findById(1);
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {

    it('should return null if payment not found', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(null);

      const updatePaymentDto: UpdatePaymentDto = {
        amount: 200,
        status: PaymentStatus.SUCCESS,
      };

      const result = await service.update(1, updatePaymentDto);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a payment', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);
      mockPaymentRepository.remove.mockResolvedValue(true);

      const result = await service.delete(1);
      expect(result).toBe(true);
    });

    it('should return false if payment not found', async () => {
      mockPaymentRepository.findOne.mockResolvedValue(null);

      const result = await service.delete(1);
      expect(result).toBe(false);
    });
  });
});
