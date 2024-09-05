import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription.dto';
import { SubscriptionPlanEntity } from './entities/subscription-plan.entity';
import { NotFoundException } from '@nestjs/common';
import { SubscriptionPlanStatus } from 'src/common/enums/generic.enum';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
    service = module.get<SubscriptionService>(SubscriptionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('createSubscriptionPlan', () => {
    it('should create a new subscription plan', async () => {
      const createDto: CreateSubscriptionPlanDto = {
        name: 'Premium Plan',
        price: 29.99,
        duration: 30,
        billingCycle: 'months',
        features: 'Access to premium features',
        status: SubscriptionPlanStatus.ACTIVE,
      };

      const result = { id: 1, ...createDto } as SubscriptionPlanEntity;

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.createSubscriptionPlan(createDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getAllSubscriptionPlans', () => {
    it('should return an array of subscription plans', async () => {
      const result: any[] = [
        {
          id: 1,
          name: 'Premium Plan',
          price: 29.99,
          duration: 30,
          billingCycle: 'months',
          features: 'Access to premium features',
          status: SubscriptionPlanStatus.ACTIVE,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.getAllSubscriptionPlans()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getSubscriptionPlanById', () => {
    it('should return a single subscription plan by ID', async () => {
      const result: any = {
        id: 1,
        name: 'Premium Plan',
        price: 29.99,
        duration: 30,
        billingCycle: 'months',
        features: 'Access to premium features',
        status: 'active',
      };

      jest.spyOn(service, 'findById').mockResolvedValue(result);

      expect(await controller.getSubscriptionPlanById(1)).toEqual(result);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if subscription plan not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(controller.getSubscriptionPlanById(1)).rejects.toThrow(NotFoundException);
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateSubscriptionPlan', () => {
    it('should update a subscription plan', async () => {
      const updateDto: any = {
        name: 'Updated Plan',
        price: 19.99,
      };

      const result: any = {
        id: 1,
        name: 'Updated Plan',
        price: 19.99,
        duration: 30,
        features: 'Access to premium features',
        status: 'active',
      };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.updateSubscriptionPlan(1, updateDto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException if subscription plan not found', async () => {
      const updateDto: any = { name: 'Updated Plan' };

      jest.spyOn(service, 'update').mockResolvedValue(null);

      await expect(controller.updateSubscriptionPlan(1, updateDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('deleteSubscriptionPlan', () => {
    it('should delete a subscription plan', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(true);

      expect(await controller.deleteSubscriptionPlan(1)).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if subscription plan not found', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(false);

      await expect(controller.deleteSubscriptionPlan(1)).rejects.toThrow(NotFoundException);
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});