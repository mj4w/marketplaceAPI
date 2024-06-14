import nodemailer from 'nodemailer';
import environment from '../env.js';
import { status } from './status.js';

export const sendResetEmail = (email,resetToken) => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: environment.user_email,
            pass: environment.app_pass
        }
    });

    const mailOptions = {
        from: environment.user_email,
        to: email,
        subject: 'Password Reset',
        html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${resetToken}">link</a> to set a new password.</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(status.error).json({ msg: "Failed to send email" });
        }
        console.log('Email sent: ' + info.response);
        res.json({ msg: 'Email sent with password reset instructions' });
    });
}