import { ConflictException, Injectable } from '@nestjs/common';
// import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlanEntity } from './entities/subscription-plan.entity';
import { Repository } from 'typeorm';
import { CreateSubscriptionPlanDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionPlanEntity) private readonly subscriptionPlanRepository: Repository<SubscriptionPlanEntity>,
  ) { }

  async create(createSubscriptionPlanDto: CreateSubscriptionPlanDto): Promise<SubscriptionPlanEntity> {
    const { name } = createSubscriptionPlanDto;
    const existingPlan = await this.subscriptionPlanRepository.findOne({ where: { name } });
    if (existingPlan) {
      throw new ConflictException(`A subscription plan with the name '${name}' already exists.`);
    }

    const newPlan = this.subscriptionPlanRepository.create(createSubscriptionPlanDto);
    return this.subscriptionPlanRepository.save(newPlan);
  }


  async findAll(): Promise<SubscriptionPlanEntity[]> {
    return this.subscriptionPlanRepository.find();
  }

  async findById(id: number): Promise<SubscriptionPlanEntity | undefined> {
    return this.subscriptionPlanRepository.findOne({ where: { id } });
  }

  async update(id: number, updateSubscriptionPlanDto: UpdateSubscriptionPlanDto): Promise<SubscriptionPlanEntity | null> {
    const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { id } });
    if (!subscriptionPlan) {
      return null;
    }
    this.subscriptionPlanRepository.merge(subscriptionPlan, updateSubscriptionPlanDto);
    return this.subscriptionPlanRepository.save(subscriptionPlan);
  }

  async delete(id: number): Promise<boolean> {
    const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { id } });
    if (!subscriptionPlan) {
      return false;
    }
    await this.subscriptionPlanRepository.remove(subscriptionPlan);
    return true;
  }
}
