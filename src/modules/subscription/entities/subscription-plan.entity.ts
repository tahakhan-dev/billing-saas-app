import { CustomerEntity } from 'src/modules/customer/entities/customer.entity';
import { InvoiceEntity } from 'src/modules/invoice/entities/invoice.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity({ name: 'subscription_plan' })
export class SubscriptionPlanEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'duration', nullable: false })
  duration: number;

  @Column({ name: 'billing_cycle', nullable: false })
  billingCycle: string; // E.g., 'days', 'months'

  @Column({ name: 'status', nullable: false })
  status: string;

  @Column({ name: 'features', type: 'text' })
  features: string;

  @OneToMany(() => CustomerEntity, customer => customer.subscriptionPlan)
  customers: CustomerEntity[];

  @OneToMany(() => InvoiceEntity, invoice => invoice.subscriptionPlan)
  invoices: InvoiceEntity[];
}
