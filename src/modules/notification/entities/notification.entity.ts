import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'notification' })
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_id', nullable: false })
    customerId: number;

    @Column({ name: 'type', nullable: false })
    type: string; // E.g., 'Email', 'SMS', 'Push'

    @Column({ name: 'reference_id', nullable: false })
    referenceId: number; // ID of related invoice or payment

    @Column({ name: 'status', nullable: false })
    status: string; // E.g., 'Sent', 'Failed', 'Pending'

    @Column({ name: 'message', type: 'text' })
    message: string; // Message content or details about the notification

    @CreateDateColumn()
    sentAt: Date;

    @Column({ name: 'error_message', nullable: true })
    errorMessage: string; // Error message if the notification fails
}
