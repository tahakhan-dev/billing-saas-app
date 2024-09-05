// src/modules/email/email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.example.com', // Replace with your SMTP host
            port: 587,
            secure: false,
            auth: {
                user: 'your-email@example.com', // Replace with your email
                pass: 'your-email-password', // Replace with your email password
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string, html: string) {
        const mailOptions = {
            from: '"Your App Name" <no-reply@example.com>', // Replace with your sender address
            to,
            subject,
            text,
            html,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error);
        }
    }
}