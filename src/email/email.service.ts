import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // Replace with your SMTP host
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER, // Replace with your email
                pass: process.env.EMAIL_PASSWORD, // Replace with your email password
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string, html: string) {
        const mailOptions = {
            from: process.env.SENDER_ADDRESS, // Replace with your sender address
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