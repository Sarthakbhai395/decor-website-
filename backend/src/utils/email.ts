import nodemailer from 'nodemailer';
import logger from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error(`Email sending failed: ${error}`);
    throw new Error('Email could not be sent');
  }
};

export const sendOTPEmail = async (email: string, otp: string, name: string): Promise<void> => {
  await sendEmail({
    to: email,
    subject: 'Verify Your Email - Luxe Celebrations',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Georgia', serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; padding: 40px 0; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #c9a96e, #f0d080); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .card { background: linear-gradient(135deg, rgba(201,169,110,0.1), rgba(240,208,128,0.05)); border: 1px solid rgba(201,169,110,0.3); border-radius: 16px; padding: 40px; margin: 20px 0; }
          .otp-box { background: linear-gradient(135deg, #c9a96e, #f0d080); border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }
          .otp { font-size: 42px; font-weight: bold; color: #0a0a0a; letter-spacing: 12px; }
          .footer { text-align: center; color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✨ Luxe Celebrations</div>
          </div>
          <div class="card">
            <h2 style="color: #c9a96e; margin-bottom: 16px;">Hello, ${name}!</h2>
            <p style="color: rgba(255,255,255,0.7); line-height: 1.6;">
              Welcome to Luxe Celebrations — where every moment becomes a masterpiece. 
              Please verify your email address using the OTP below:
            </p>
            <div class="otp-box">
              <div class="otp">${otp}</div>
            </div>
            <p style="color: rgba(255,255,255,0.5); font-size: 14px;">
              This OTP expires in <strong style="color: #c9a96e;">10 minutes</strong>. 
              Do not share it with anyone.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Luxe Celebrations. All rights reserved.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

export const sendBookingConfirmationEmail = async (
  email: string,
  name: string,
  bookingDetails: {
    bookingId: string;
    service: string;
    date: string;
    time: string;
    amount: number;
  }
): Promise<void> => {
  await sendEmail({
    to: email,
    subject: `Booking Confirmed #${bookingDetails.bookingId} - Luxe Celebrations`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Georgia', serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #c9a96e, #f0d080); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center; }
          .card { background: linear-gradient(135deg, rgba(201,169,110,0.1), rgba(240,208,128,0.05)); border: 1px solid rgba(201,169,110,0.3); border-radius: 16px; padding: 40px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .label { color: rgba(255,255,255,0.5); }
          .value { color: #c9a96e; font-weight: bold; }
          .badge { background: linear-gradient(135deg, #c9a96e, #f0d080); color: #0a0a0a; padding: 8px 20px; border-radius: 50px; font-weight: bold; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">✨ Luxe Celebrations</div>
          <div class="card">
            <div style="text-align: center; margin-bottom: 30px;">
              <div class="badge">✓ Booking Confirmed</div>
            </div>
            <h2 style="color: #c9a96e;">Dear ${name},</h2>
            <p style="color: rgba(255,255,255,0.7);">Your luxury experience has been confirmed. Here are your booking details:</p>
            <div style="margin: 20px 0;">
              <div class="detail-row"><span class="label">Booking ID</span><span class="value">#${bookingDetails.bookingId}</span></div>
              <div class="detail-row"><span class="label">Service</span><span class="value">${bookingDetails.service}</span></div>
              <div class="detail-row"><span class="label">Date</span><span class="value">${bookingDetails.date}</span></div>
              <div class="detail-row"><span class="label">Time</span><span class="value">${bookingDetails.time}</span></div>
              <div class="detail-row"><span class="label">Amount</span><span class="value">₹${bookingDetails.amount.toLocaleString()}</span></div>
            </div>
            <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 20px;">
              Our team will contact you 24 hours before your event. For any queries, reach us at support@luxecelebrations.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;
  await sendEmail({
    to: email,
    subject: 'Reset Your Password - Luxe Celebrations',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Georgia', serif; background: #0a0a0a; color: #fff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .btn { background: linear-gradient(135deg, #c9a96e, #f0d080); color: #0a0a0a; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 style="color: #c9a96e; text-align: center;">✨ Luxe Celebrations</h1>
          <h2>Hello ${name},</h2>
          <p style="color: rgba(255,255,255,0.7);">We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>
          <p style="color: rgba(255,255,255,0.5); font-size: 14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      </body>
      </html>
    `,
  });
};
