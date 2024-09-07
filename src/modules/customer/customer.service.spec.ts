import { SubscriptionPlanEntity } from '../subscription/entities/subscription-plan.entity';
import { InvoiceEntity } from '../invoice/entities/invoice.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: Repository<CustomerEntity>;
  let subscriptionPlanRepository: Repository<SubscriptionPlanEntity>;
  let invoiceRepository: Repository<InvoiceEntity>;
  let jwtService: JwtService;

  const mockCustomer: any = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date(),
    subscriptionEndDate: new Date(),
    lastPaymentDate: new Date(),
    created_at: new Date(),
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

  const mockCustomerRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockSubscriptionPlanRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockInvoiceRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: getRepositoryToken(CustomerEntity), useValue: mockCustomerRepository },
        { provide: getRepositoryToken(SubscriptionPlanEntity), useValue: mockSubscriptionPlanRepository },
        { provide: getRepositoryToken(InvoiceEntity), useValue: mockInvoiceRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<Repository<CustomerEntity>>(getRepositoryToken(CustomerEntity));
    subscriptionPlanRepository = module.get<Repository<SubscriptionPlanEntity>>(getRepositoryToken(SubscriptionPlanEntity));
    invoiceRepository = module.get<Repository<InvoiceEntity>>(getRepositoryToken(InvoiceEntity));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);
      mockSubscriptionPlanRepository.findOne.mockResolvedValue(mockSubscriptionPlan);
      mockCustomerRepository.create.mockReturnValue(mockCustomer);
      mockCustomerRepository.save.mockResolvedValue(mockCustomer);
      mockJwtService.signAsync.mockResolvedValue('token');

      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        subscriptionPlanId: 1,
      };

      const result = await service.create(createCustomerDto);
      expect(result).toEqual({ customer: mockCustomer, accessToken: 'token' });
    });

    it('should return existing customer if already exists', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockJwtService.signAsync.mockResolvedValue('token');

      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        subscriptionPlanId: 1,
      };

      const result = await service.create(createCustomerDto);
      expect(result).toEqual({ customer: mockCustomer, accessToken: 'token' });
    });

    it('should throw NotFoundException if subscription plan is not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);
      mockSubscriptionPlanRepository.findOne.mockResolvedValue(null);

      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        subscriptionPlanId: 1,
      };

      await expect(service.create(createCustomerDto))
        .rejects.toThrow(
          new NotFoundException('Subscription Plan with ID 1 not found'),
        );
    });
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      mockCustomerRepository.find.mockResolvedValue([mockCustomer]);

      const result = await service.findAll();
      expect(result).toEqual([mockCustomer]);
    });
  });

  describe('findById', () => {
    it('should return a customer by ID', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);

      const result = await service.findById(1);
      expect(result).toEqual(mockCustomer);
    });

    it('should return undefined if customer not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findById(1);
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockCustomerRepository.merge.mockReturnValue(mockCustomer);
      mockCustomerRepository.save.mockResolvedValue(mockCustomer);

      const updateCustomerDto: UpdateCustomerDto = {
        name: 'Updated Name',
      };

      const result = await service.update(1, updateCustomerDto);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockCustomerRepository.remove.mockResolvedValue(true);

      const result = await service.delete(1);
      expect(result).toBe(true);
    });

    it('should return false if customer not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);

      const result = await service.delete(1);
      expect(result).toBe(false);
    });
  });

  describe('assignSubscriptionPlan', () => {
    it('should assign a subscription plan to a customer', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockSubscriptionPlanRepository.findOne.mockResolvedValue(mockSubscriptionPlan);
      mockCustomerRepository.save.mockResolvedValue(mockCustomer);

      const result = await service.assignSubscriptionPlan(1, 1);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException if customer is not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);

      await expect(service.assignSubscriptionPlan(1, 1))
        .rejects.toThrow(
          new NotFoundException(`Customer with ID 1 not found.`),
        );
    });

    it('should throw NotFoundException if subscription plan is not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockSubscriptionPlanRepository.findOne.mockResolvedValue(null);

      await expect(service.assignSubscriptionPlan(1, 1)).rejects.toThrow(
        new NotFoundException(`Subscription plan with ID 1 not found.`),
      );
    });
  });
});
