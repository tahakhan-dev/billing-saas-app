import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { JwtService } from '@nestjs/jwt';
import { CreateCustomerDto } from './dto/create-customer.dto';

describe('CustomerController', () => {
  let controller: CustomerController;
  const mockCustomerService = {
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
        JwtService,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Example: Create customer
  it('should create a customer', async () => {
    const createCustomerDto = {
      name: "John Doe",
      email: "johndoe@example.com",
      subscriptionPlanId: 1,
      subscription_status: "active",
      last_payment_date: new Date()
    } as CreateCustomerDto;
    const customer = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
     mockCustomerService.create.mockResolvedValue(customer);

    expect(await controller.createCustomer(createCustomerDto)).toEqual(customer);
    expect(mockCustomerService.create).toHaveBeenCalledWith(createCustomerDto);
  });

  // More test cases for update, findOne, remove...
});