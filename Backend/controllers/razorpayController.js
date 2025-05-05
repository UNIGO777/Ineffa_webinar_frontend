import razorpayInstance from '../config/razorpay.js';
import Payment from '../models/Payment.js';
import Consultation from '../models/Consultation.js';
import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import crypto from 'crypto';
import { sendConsultationConfirmation } from '../config/nodemailer.js';

// Create a Razorpay order
export const createOrder = catchAsync(async (req, res, next) => {
  const { consultationId, amount } = req.body;
  
  if (!consultationId || !amount) {
    return next(new AppError('Please provide consultation ID and amount', 400));
  }
  
  // Check if consultation exists
  const consultation = await Consultation.findById(consultationId);
  
  if (!consultation) {
    return next(new AppError('No consultation found with that ID', 404));
  }
  
  // Create Razorpay order
  const options = {
    amount: amount * 100, // Razorpay amount is in paisa (1/100 of INR)
    currency: 'INR',
    receipt: `consultation_${consultationId}`,
    payment_capture: 1 // Auto-capture payment
  };
  
  try {
    const order = await razorpayInstance.orders.create(options);
    
    // Create a pending payment record
    const payment = await Payment.create({
      consultationId,
      amount,
      paymentMethod: 'razorpay',
      transactionId: order.id,
      status: 'pending',
      metadata: { orderId: order.id }
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        order,
        payment,
        key_id: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    return next(new AppError(`Razorpay order creation failed: ${error.message}`, 500));
  }
});

// Verify Razorpay payment
export const verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new AppError('Missing payment verification parameters', 400));
  }
  
  // Find the payment by order ID
  const payment = await Payment.findOne({
    'metadata.orderId': razorpay_order_id
  }).populate('consultationId');
  
  if (!payment) {
    return next(new AppError('No payment found with that order ID', 404));
  }
  
  // Verify signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  
  if (generatedSignature !== razorpay_signature) {
    // Update payment status to failed
    payment.status = 'failed';
    await payment.save();
    
    return next(new AppError('Invalid payment signature', 400));
  }
  
  // Update payment status to completed
  payment.status = 'completed';
  payment.transactionId = razorpay_payment_id;
  await payment.save();
  
  // Update consultation payment status
  if (payment.consultationId) {
    const consultation = await Consultation.findByIdAndUpdate(
      payment.consultationId._id,
      { status: "booked" , paymentStatus: 'completed' },
      { new: true }
    );
    
    // Create a notification for payment completion
    if (consultation) {
      try {
        await Notification.create({
          title: 'Payment Completed',
          message: `Payment has been completed for the consultation booked by ${consultation.name} for ${consultation.service} service on ${new Date(consultation.slotDate).toLocaleDateString()}.`,
          type: 'success'
        });

        // Send WhatsApp message notification
        try {
          const whatsappApiUrl = `http://ow.ewiths.com/wapp/api/v2/send/bytemplate?apikey=e1e61ebd1bd9437191c5cf44cdf973cf&templatename=whatsapp_consultation_massage&mobile=${consultation.phone}`;
          
          const response = await fetch(whatsappApiUrl, {
            method: 'GET'
          });

          if (!response.ok) {
            console.error('Failed to send WhatsApp notification:', await response.text());
          }

          // Send confirmation email
          const bookingDetails = {
            name: consultation.name,
            date: new Date(consultation.slotDate).toLocaleDateString(),
            time: `${consultation.slotStartTime} - ${consultation.slotEndTime}`,
            service: consultation.service,
            consultantName: consultation.consultantName
          };

          const emailResult = await sendConsultationConfirmation(consultation.email, bookingDetails);
          if (!emailResult.success) {
            console.error('Error sending confirmation email:', emailResult.error);
          }

        } catch (error) {
          console.error('Error sending notifications:', error);
        }

      } catch (error) {
        console.error('Error creating payment notification:', error);
      }
    }
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      payment
    }
  });
});

// Get Razorpay key
export const getRazorpayKey = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      key_id: process.env.RAZORPAY_KEY_ID
    }
  });
});