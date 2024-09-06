import { SubscriptionPlanEntity } from 'src/modules/subscription/entities/subscription-plan.entity';
import { SubscriptionPlanStatus } from 'src/common/enums/generic.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class Seeder {
    constructor(
        @InjectRepository(SubscriptionPlanEntity)
        private readonly subscriptionPlanRepository: Repository<SubscriptionPlanEntity>,
    ) { }

    async seed() {
        const subscriptionPlans = [
            { name: 'Basic Plan', price: 9.99, duration: 30, billingCycle: 'days', status: SubscriptionPlanStatus.ACTIVE, features: 'Access to basic features' },
            { name: 'Standard Plan', price: 19.99, duration: 1, billingCycle: 'months', status: SubscriptionPlanStatus.ACTIVE, features: 'Access to standard features plus 24/7 support' },
            { name: 'Premium Plan', price: 29.99, duration: 1, billingCycle: 'months', status: SubscriptionPlanStatus.ACTIVE, features: 'Access to all features, priority support, and premium content' },
            { name: 'Annual Basic Plan', price: 99.99, duration: 12, billingCycle: 'months', status: SubscriptionPlanStatus.ACTIVE, features: 'Access to basic features with annual billing' },
            { name: 'Annual Premium Plan', price: 299.99, duration: 12, billingCycle: 'months', status: SubscriptionPlanStatus.ACTIVE, features: 'Access to all features with a discounted annual rate' },
            { name: 'Enterprise Plan', price: 199.99, duration: 1, billingCycle: 'months', status: SubscriptionPlanStatus.ACTIVE, features: 'Customizable plan with enterprise-level support and features' },
            { name: 'Trial Plan', price: 0.00, duration: 14, billingCycle: 'days', status: SubscriptionPlanStatus.INACTIVE, features: 'Free trial with access to basic features' },
        ];

        for (const subscriptionPlan of subscriptionPlans) {
            const existingPlan = await this.subscriptionPlanRepository.findOne({ where: { name: subscriptionPlan.name } });
            if (!existingPlan) {
                const newSubscriptionPlan = this.subscriptionPlanRepository.create(subscriptionPlan);
                await this.subscriptionPlanRepository.save(newSubscriptionPlan);
            }
        }
    }
}
