import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { InvoiceEntity } from './entities/invoice.entity';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceStatus } from 'src/common/enums/generic.enum';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let invoiceRepository: Repository<InvoiceEntity>;
  let customerRepository: Repository<CustomerEntity>;
  let subscriptionPlanRepository: Repository<SubscriptionPlanEntity>;
  let eventEmitter: EventEmitter2;

  const mockCustomer: CustomerEntity = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date(),
    subscriptionEndDate: new Date(),
    lastPaymentDate: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    subscriptionPlan: {} as SubscriptionPlanEntity,
    invoices: [],
  };

  const mockSubscriptionPlan: SubscriptionPlanEntity = {
    id: 1,
    name: 'Basic Plan',
    price: 9.99,
    duration: 30,
    billingCycle: 'days',
    status: 'active',
    features: 'Basic features',
    customers: [],
    invoices: [],
  };

  const mockInvoice: InvoiceEntity = {
    id: 1,
    amount: 100,
    issueDate: new Date(),
    dueDate: new Date(),
    paymentDate: null,
    status: 'pending',
    customer: mockCustomer,
    subscriptionPlan: mockSubscriptionPlan,
    payments: [],
  };

  const mockInvoiceRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockCustomerRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockSubscriptionPlanRepository = {
    findOne: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        { provide: getRepositoryToken(InvoiceEntity), useValue: mockInvoiceRepository },
        { provide: getRepositoryToken(CustomerEntity), useValue: mockCustomerRepository },
        { provide: getRepositoryToken(SubscriptionPlanEntity), useValue: mockSubscriptionPlanRepository },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    invoiceRepository = module.get<Repository<InvoiceEntity>>(getRepositoryToken(InvoiceEntity));
    customerRepository = module.get<Repository<CustomerEntity>>(getRepositoryToken(CustomerEntity));
    subscriptionPlanRepository = module.get<Repository<SubscriptionPlanEntity>>(getRepositoryToken(SubscriptionPlanEntity));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an invoice and emit an event', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockSubscriptionPlanRepository.findOne.mockResolvedValue(mockSubscriptionPlan);
      mockInvoiceRepository.create.mockReturnValue(mockInvoice);
      mockInvoiceRepository.save.mockResolvedValue(mockInvoice);

      const createInvoiceDto: CreateInvoiceDto = {
        customerId: 1,
        subscriptionPlanId: 1,
        amount: 100,
        issueDate: new Date(),
        paymentDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PENDING,
      };

      const result = await service.create(createInvoiceDto);
      expect(result).toEqual(mockInvoice);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'invoice.created',
        expect.any(Object),
      );
    });

    it('should throw NotFoundException if customer is not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);

      const createInvoiceDto: CreateInvoiceDto = {
        customerId: 1,
        subscriptionPlanId: 1,
        amount: 100,
        issueDate: new Date(),
        paymentDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PENDING,
      };

      await expect(service.create(createInvoiceDto)).rejects.toThrow(
        new NotFoundException('This Customer Does not Exists.'),
      );
    });

    it('should throw NotFoundException if subscription plan is not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockSubscriptionPlanRepository.findOne.mockResolvedValue(null);

      const createInvoiceDto: CreateInvoiceDto = {
        customerId: 1,
        subscriptionPlanId: 1,
        amount: 100,
        issueDate: new Date(),
        paymentDate: new Date(),
        dueDate: new Date(),
        status: InvoiceStatus.PENDING,
      };

      await expect(service.create(createInvoiceDto)).rejects.toThrow(
        new NotFoundException('Subscription Plan with ID 1 not found'),
      );
    });
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      mockInvoiceRepository.find.mockResolvedValue([mockInvoice]);

      const result = await service.findAll();
      expect(result).toEqual([mockInvoice]);
    });
  });

  describe('findById', () => {
    it('should return an invoice by ID', async () => {
      mockInvoiceRepository.findOne.mockResolvedValue(mockInvoice);

      const result = await service.findById(1);
      expect(result).toEqual(mockInvoice);
    });

    it('should return undefined if invoice not found', async () => {
      mockInvoiceRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findById(1);
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {

    it('should return null if invoice not found', async () => {
      mockInvoiceRepository.findOne.mockResolvedValue(null);

      const updateInvoiceDto: UpdateInvoiceDto = {
        amount: 200,
        status: InvoiceStatus.PAID,
      };

      const result = await service.update(1, updateInvoiceDto);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an invoice', async () => {
      mockInvoiceRepository.findOne.mockResolvedValue(mockInvoice);
      mockInvoiceRepository.remove.mockResolvedValue(true);

      const result = await service.delete(1);
      expect(result).toBe(true);
    });

    it('should return false if invoice not found', async () => {
      mockInvoiceRepository.findOne.mockResolvedValue(null);

      const result = await service.delete(1);
      expect(result).toBe(false);
    });
  });

  describe('generateInvoicesForDueCustomers', () => {
    it('should generate invoices for due customers and emit events', async () => {
      const mockCustomers = [mockCustomer];
      mockCustomerRepository.find.mockResolvedValue(mockCustomers);
      mockInvoiceRepository.create.mockReturnValue(mockInvoice);
      mockInvoiceRepository.save.mockResolvedValue(mockInvoice);

      await service.generateInvoicesForDueCustomers();

      expect(mockInvoiceRepository.create).toHaveBeenCalled();
      expect(mockInvoiceRepository.save).toHaveBeenCalled();
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'invoice.created',
        expect.any(Object),
      );
    });
  });
});
