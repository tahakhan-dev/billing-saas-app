import { NotificationService } from './notification.service';
import { EmailService } from '../email/email.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [NotificationService, EmailService],
})
export class NotificationModule { }