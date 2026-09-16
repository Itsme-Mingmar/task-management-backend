import dotenv from "dotenv"
import nodemailer from 'nodemailer'
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export class Email {
    async sendCreatedEmail(email:string): Promise<void> {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "New Todo created",
            text: `Your todo created successfully`
        })
    }
    async sendCompletedEmail(): Promise<void> {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "mingmardorjetamang17@gmail.com",
            subject: "Todo Completed",
            text: `Todo completed`
        })
    }
}