import { InvoiceEntity } from 'src/modules/invoice/entities/invoice.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'payment' })
export class PaymentEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @ManyToOne(() => InvoiceEntity, invoice => invoice.payments)
    invoice: InvoiceEntity;

    @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ name: 'payment_date', type: 'timestamp' })
    paymentDate: Date;

    @Column({ name: 'payment_method', nullable: false })
    paymentMethod: string;

    @Column({ name: 'status', nullable: false })
    status: string;
}
