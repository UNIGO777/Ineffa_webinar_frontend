import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send OTP email
export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Ineffa Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Ineffa Login',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333366;">Ineffa Authentication</h2>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for login is:</p>
        <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
        <p>Regards,<br>Ineffa Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};


// Function to send consultation booking confirmation email
export const sendConsultationConfirmation = async (email, bookingDetails) => {
  const mailOptions = {
    from: `"Ineffa Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Consultation Booking Confirmation - Ineffa',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333366;">Consultation Booking Confirmation</h2>
        <p>Dear ${bookingDetails.name},</p>
        <p>Thank you for booking a consultation with Ineffa. Your booking has been confirmed.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #333366;">Booking Details:</h3>
          <p><strong>Date:</strong> ${bookingDetails.date}</p>
          <p><strong>Time:</strong> ${bookingDetails.time}</p>
          <p><strong>Service:</strong> ${bookingDetails.service}</p>
          ${bookingDetails.consultantName ? `<p><strong>Consultant:</strong> ${bookingDetails.consultantName}</p>` : ''}
        </div>

        <p>Please make sure to join the consultation at the scheduled time. You will receive a separate email with the meeting link (if applicable).</p>
        
        <p>If you need to reschedule or cancel your consultation, please contact us at least 24 hours before the scheduled time.</p>
        
        <p>For any queries, feel free to reach out to our support team.</p>
        
        <p>Best regards,<br>Ineffa Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending consultation confirmation email:', error);
    return { success: false, error: error.message };
  }
};





export default transporter;