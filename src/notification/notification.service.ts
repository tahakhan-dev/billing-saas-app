import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email/email.service';
import { InvoiceCreatedEvent } from 'src/email/events/invoice-created.event';
import { PaymentSuccessfulEvent } from 'src/email/events/payment-successful.event';
import { PaymentFailedEvent } from 'src/email/events/payment-failed.event';

@Injectable()
export class NotificationService {
    constructor(private readonly emailService: EmailService) { }

    @OnEvent('invoice.created')
    handleInvoiceCreatedEvent(event: InvoiceCreatedEvent) {
        console.log('Invoice created event received:', event);
        
        const subject = `Invoice #${event.invoiceId} Created`;
        const text = `Your invoice #${event.invoiceId} for ${event.amount} has been created.`;
        const html = `<p>Your invoice #${event.invoiceId} for ${event.amount} has been created.</p>`;

        this.emailService.sendEmail(event.customerEmail, subject, text, html);
    }

    @OnEvent('payment.successful')
    handlePaymentSuccessfulEvent(event: PaymentSuccessfulEvent) {
        const subject = `Payment Successful for Invoice #${event.invoiceId}`;
        const text = `Your payment of ${event.amount} for invoice #${event.invoiceId} was successful.`;
        const html = `<p>Your payment of ${event.amount} for invoice #${event.invoiceId} was successful.</p>`;

        this.emailService.sendEmail(event.customerEmail, subject, text, html);
    }

    @OnEvent('payment.failed')
    handlePaymentFailedEvent(event: PaymentFailedEvent) {
        const subject = `Payment Failed for Invoice #${event.invoiceId}`;
        const text = `Your payment of ${event.amount} for invoice #${event.invoiceId} failed.`;
        const html = `<p>Your payment of ${event.amount} for invoice #${event.invoiceId} failed.</p>`;

        this.emailService.sendEmail(event.customerEmail, subject, text, html);
    }
}