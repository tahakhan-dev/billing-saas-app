import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { SubscriptionPlanEntity } from 'src/modules/subscription/entities/subscription-plan.entity';
import { InvoiceEntity } from 'src/modules/invoice/entities/invoice.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'customer' })
export class CustomerEntity {

    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'name', nullable: false })
    name: string;

    @Column({ name: 'email', nullable: false })
    email: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => SubscriptionPlanEntity, subscriptionPlan => subscriptionPlan.customers)
    @JoinColumn({ name: 'subscriptionPlanId' }) // This should match the DB column if different
    @ApiProperty({ type: () => SubscriptionPlanEntity })
    subscriptionPlan: SubscriptionPlanEntity;

    @Column({ name: 'subscription_status', nullable: false })
    subscriptionStatus: string;

    @Column({ name: 'subscription_start_date', type: 'date', nullable: true })
    subscriptionStartDate: Date;

    @Column({ name: "subscription_end_date", type: 'date', nullable: false })
    subscriptionEndDate: Date;

    @Column({ name: "last_payment_date", type: 'date' })
    lastPaymentDate: Date;

    @OneToMany(() => InvoiceEntity, invoice => invoice.customer)
    invoices: InvoiceEntity[];

}
