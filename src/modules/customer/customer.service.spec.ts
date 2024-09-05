import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

describe('CustomerService', () => {
  let service: CustomerService;
  const mockCustomerRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(CustomerEntity),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
    mockCustomerRepository.save.mockResolvedValue(customer);

    expect(await service.create(createCustomerDto)).toEqual(customer);
    expect(mockCustomerRepository.save).toHaveBeenCalledWith(createCustomerDto);
  });

  // More test cases for update, find, delete...
});