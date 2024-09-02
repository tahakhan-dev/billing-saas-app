import { InvoiceEntity } from 'src/modules/invoice/entities/invoice.entity';
import { SubscriptionPlanEntity } from 'src/modules/subscription/entities/subscription-plan.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';

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
    subscriptionPlan: SubscriptionPlanEntity;

    @Column({ name: 'subscription_status', nullable: false })
    subscription_status: string;

    @Column({ type: 'date' })
    last_payment_date: Date;

    @OneToMany(() => InvoiceEntity, invoice => invoice.customer)
    invoices: InvoiceEntity[];

}
