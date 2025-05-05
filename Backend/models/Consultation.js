import mongoose from "mongoose";


const consultationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    slotDate: {
        type: Date,
        required: true
    },
    slotStartTime: {
        type: String,
        required: true
    },
    slotEndTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'booked', 'completed', 'cancelled', 'scheduled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Consultation', consultationSchema);
