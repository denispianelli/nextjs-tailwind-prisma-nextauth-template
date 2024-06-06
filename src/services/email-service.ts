import nodemailer from 'nodemailer';
import { TransportOptions } from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVER_SERVICE,
  port: process.env.EMAIL_SERVER_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
} as TransportOptions);

export async function sendMail(code: string, email: string) {
  const mailOptions = {
    from: 'from@email.fr',
    to: email,
    subject: 'Please verify your email',
    html: `<p>Your code : ${code}</p>`,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const emailEncoded = encodeURIComponent(email);

  const mailOptions = {
    from: 'from@mail.fr',
    to: email,
    subject: 'Password reset',
    html: `
		<p>Hello, ${email}</p>
		<p>Click on the link below to reset your password</p>
		<a href="http://nextjs-tailwind-prisma-nextauth-template.vercel.app/users/password_reset/edit?reset_password_token=${token}&email=${emailEncoded}">Reset password</a>
		<p>If you did not request a password reset, please ignore this email.</p>
		`,
  };

  await transporter.sendMail(mailOptions);
}
