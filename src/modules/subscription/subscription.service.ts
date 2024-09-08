import { SubscriptionPlanEntity } from './entities/subscription-plan.entity';
import { CreateSubscriptionPlanDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    try {
      return this.subscriptionPlanRepository.find();
    } catch (error) {
      console.error(error);
    }
  }

  async findById(id: number): Promise<SubscriptionPlanEntity | undefined> {
    try {
      return this.subscriptionPlanRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateSubscriptionPlanDto: UpdateSubscriptionPlanDto): Promise<SubscriptionPlanEntity | null> {
    try {
      const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { id } });
      if (!subscriptionPlan) {
        return null;
      }
      this.subscriptionPlanRepository.merge(subscriptionPlan, updateSubscriptionPlanDto);
      return this.subscriptionPlanRepository.save(subscriptionPlan);
    } catch (error) {
      console.error(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const subscriptionPlan = await this.subscriptionPlanRepository.findOne({ where: { id } });
      if (!subscriptionPlan) {
        return false;
      }
      await this.subscriptionPlanRepository.remove(subscriptionPlan);
      return true;
    } catch (error) {
      console.error(error);
    }
  }
}
