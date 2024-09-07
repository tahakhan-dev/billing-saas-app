import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { CustomerController } from './customer.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { NotFoundException } from '@nestjs/common';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomer: CustomerEntity = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date(),
    subscriptionEndDate: new Date(),
    lastPaymentDate: new Date(),
    subscriptionPlan: null,
    invoices: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockCreateCustomerDto: CreateCustomerDto = {
    name: 'John Doe',
    email: 'john@example.com',
    subscriptionPlanId: 1,
  };

  const mockUpdateCustomerDto: UpdateCustomerDto = {
    name: 'John Updated',
    email: 'john@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            create: jest.fn().mockResolvedValue({ customer: mockCustomer, accessToken: 'token123' }),
            findAll: jest.fn().mockResolvedValue([mockCustomer]),
            findById: jest.fn().mockResolvedValue(mockCustomer),
            update: jest.fn().mockResolvedValue(mockCustomer),
            delete: jest.fn().mockResolvedValue(true),
            assignSubscriptionPlan: jest.fn().mockResolvedValue(mockCustomer),
            upgradeOrDowngradeSubscription: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCustomer', () => {
    it('should create a customer and return it with an access token', async () => {
      const result = await controller.createCustomer(mockCreateCustomerDto);

      expect(result.data.customer).toEqual(mockCustomer);
      expect(result.data.accessToken).toEqual('token123');
    });
  });

  describe('getAllCustomers', () => {
    it('should return an array of customers', async () => {
      const result = await controller.getAllCustomers();

      expect(result).toEqual([mockCustomer]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer by ID', async () => {
      const result = await controller.getCustomerById(1);

      expect(result).toEqual(mockCustomer);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when customer is not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValueOnce(null);

      await expect(controller.getCustomerById(2)).rejects.toThrow(new NotFoundException(`Customer with ID 2 not found.`));
    });
  });

  describe('updateCustomer', () => {
    it('should update the customer information', async () => {
      const result = await controller.updateCustomer(1, mockUpdateCustomerDto);

      expect(result).toEqual(mockCustomer);
      expect(service.update).toHaveBeenCalledWith(1, mockUpdateCustomerDto);
    });

    it('should throw NotFoundException if customer is not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce(null);

      await expect(controller.updateCustomer(2, mockUpdateCustomerDto)).rejects.toThrow(
        new NotFoundException(`Customer with ID 2 not found.`),
      );
    });
  });

  describe('deleteCustomer', () => {
    it('should delete the customer', async () => {
      const result = await controller.deleteCustomer(1);

      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if customer is not found', async () => {
      jest.spyOn(service, 'delete').mockResolvedValueOnce(false);

      await expect(controller.deleteCustomer(2)).rejects.toThrow(new NotFoundException(`Customer with ID 2 not found.`));
    });
  });

  describe('assignSubscription', () => {
    it('should assign a subscription plan to the customer', async () => {
      const result = await controller.assignSubscription(1, 2);

      expect(result).toEqual(mockCustomer);
      expect(service.assignSubscriptionPlan).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('upgradeOrDowngradeSubscription', () => {
    it('should upgrade or downgrade a customer subscription plan with prorated billing', async () => {
      const result = await controller.upgradeOrDowngradeSubscription(1, { newPlanId: 3 });

      expect(result).toEqual(mockCustomer);
      expect(service.upgradeOrDowngradeSubscription).toHaveBeenCalledWith(1, 3);
    });
  });
});
