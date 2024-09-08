import { SubscriptionPlanEntity } from './entities/subscription-plan.entity';
import { CreateSubscriptionPlanDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription.dto';
import { SubscriptionPlanStatus } from 'src/common/enums/generic.enum';
import { SubscriptionService } from './subscription.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repository: Repository<SubscriptionPlanEntity>;

  const mockSubscriptionPlan: SubscriptionPlanEntity = {
    id: 1,
    name: 'Basic Plan',
    price: 9.99,
    duration: 30,
    billingCycle: 'days',
    status: 'active',
    features: 'Access to basic features',
    customers: [],
    invoices: [],
  };

  const mockCreateSubscriptionPlanDto: CreateSubscriptionPlanDto = {
    name: 'Basic Plan',
    price: 9.99,
    duration: 30,
    billingCycle: 'days',
    status: SubscriptionPlanStatus.ACTIVE,
    features: 'Access to basic features',
  };

  const mockUpdateSubscriptionPlanDto: UpdateSubscriptionPlanDto = {
    price: 19.99,
    status: SubscriptionPlanStatus.INACTIVE,
  };

  const subscriptionPlanRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: getRepositoryToken(SubscriptionPlanEntity),
          useValue: subscriptionPlanRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    repository = module.get<Repository<SubscriptionPlanEntity>>(getRepositoryToken(SubscriptionPlanEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new subscription plan', async () => {
      repository.findOne = jest.fn().mockResolvedValue(null);
      repository.create = jest.fn().mockReturnValue(mockSubscriptionPlan);
      repository.save = jest.fn().mockResolvedValue(mockSubscriptionPlan);

      const result = await service.create(mockCreateSubscriptionPlanDto);
      expect(result).toEqual(mockSubscriptionPlan);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: 'Basic Plan' } });
      expect(repository.create).toHaveBeenCalledWith(mockCreateSubscriptionPlanDto);
      expect(repository.save).toHaveBeenCalledWith(mockSubscriptionPlan);
    });

    it('should throw ConflictException if plan already exists', async () => {
      repository.findOne = jest.fn().mockResolvedValue(mockSubscriptionPlan);

      await expect(service.create(mockCreateSubscriptionPlanDto)).rejects.toThrow(
        new ConflictException(`A subscription plan with the name 'Basic Plan' already exists.`),
      );
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: 'Basic Plan' } });
    });
  });

  describe('findAll', () => {
    it('should return all subscription plans', async () => {
      repository.find = jest.fn().mockResolvedValue([mockSubscriptionPlan]);

      const result = await service.findAll();
      expect(result).toEqual([mockSubscriptionPlan]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a subscription plan by ID', async () => {
      repository.findOne = jest.fn().mockResolvedValue(mockSubscriptionPlan);

      const result = await service.findById(1);
      expect(result).toEqual(mockSubscriptionPlan);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return undefined if subscription plan not found', async () => {
      repository.findOne = jest.fn().mockResolvedValue(undefined);

      const result = await service.findById(1);
      expect(result).toBeUndefined();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a subscription plan', async () => {
      repository.findOne = jest.fn().mockResolvedValue(mockSubscriptionPlan);
      repository.merge = jest.fn().mockReturnValue(mockSubscriptionPlan);
      repository.save = jest.fn().mockResolvedValue(mockSubscriptionPlan);

      const result = await service.update(1, mockUpdateSubscriptionPlanDto);
      expect(result).toEqual(mockSubscriptionPlan);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.merge).toHaveBeenCalledWith(mockSubscriptionPlan, mockUpdateSubscriptionPlanDto);
      expect(repository.save).toHaveBeenCalledWith(mockSubscriptionPlan);
    });

    it('should return null if subscription plan not found', async () => {
      repository.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.update(2, mockUpdateSubscriptionPlanDto);
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    });
  });

  describe('delete', () => {
    it('should delete a subscription plan', async () => {
      repository.findOne = jest.fn().mockResolvedValue(mockSubscriptionPlan);
      repository.remove = jest.fn().mockResolvedValue(true);

      const result = await service.delete(1);
      expect(result).toBe(true);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(mockSubscriptionPlan);
    });

    it('should return false if subscription plan not found', async () => {
      repository.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.delete(2);
      expect(result).toBe(false);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    });
  });
});
