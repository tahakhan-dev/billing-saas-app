import { SubscriptionPlanEntity } from 'src/modules/subscription/entities/subscription-plan.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CustomerEntity } from 'src/modules/customer/entities/customer.entity';
import { PaymentEntity } from 'src/modules/payment/entities/payment.entity';

@Entity({ name: 'invoice' })
export class InvoiceEntity {

    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @ManyToOne(() => CustomerEntity, customer => customer.invoices)
    customer: CustomerEntity;

    @ManyToOne(() => SubscriptionPlanEntity, subscriptionPlan => subscriptionPlan.invoices)
    subscriptionPlan: SubscriptionPlanEntity;

    @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ name: 'issueDate', type: 'timestamp' })
    issueDate: Date;

    @Column({ name: 'due_date', type: 'timestamp' })
    dueDate: Date;

    @Column({ name: 'payment_date', type: 'timestamp', nullable: true })
    paymentDate: Date;

    @Column({ name: 'status' })
    status: string;

    @OneToMany(() => PaymentEntity, payment => payment.invoice)
    payments: PaymentEntity[];
}
