import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays } from 'date-fns';
import logoImg from './assets/Logo.png'

const RescheduleConsultaion = () => {
  const navigate = useNavigate();
  
  // State for multi-step form
  const [step, setStep] = useState(1);
  
  // State for phone verification
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);
  
  // State for OTP verification
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  
  // State for consultations
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  
  // State for slot selection
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 2));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  
  // State for confirmation
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');
  
  // General alert state
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'error' });

  // Validate phone number
  const validatePhone = () => {
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  // Handle phone verification
  const handlePhoneVerification = async (e) => {
    e.preventDefault();
    
    if (!validatePhone()) return;
    
    setIsPhoneVerifying(true);
    setAlert({ show: false, message: '', variant: 'error' });
    
    try {
      const response = await axios.post(`${API_URL}/reschedule/verify-phone`, { phone });
      
      setMaskedEmail(response.data.data.email);
      setIsPhoneVerifying(false);
      setStep(2); // Move to OTP verification step
    } catch (error) {
      setIsPhoneVerifying(false);
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Failed to verify phone number. Please try again.',
        variant: 'error'
      });
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      setOtpError('OTP is required');
      return;
    }
    
    setIsOtpVerifying(true);
    setAlert({ show: false, message: '', variant: 'error' });
    
    try {
      const response = await axios.post(`${API_URL}/reschedule/verify-otp`, { phone, otp });
      
      setConsultations(response.data.data.consultations);
      setIsOtpVerifying(false);
      setStep(3); // Move to consultation selection step
    } catch (error) {
      setIsOtpVerifying(false);
      setOtpError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  // Handle consultation selection
  const handleConsultationSelect = (consultation) => {
    setSelectedConsultation(consultation);
    setStep(4); // Move to slot selection step
    fetchAvailableSlots(selectedDate);
  };

  // Fetch available slots for the selected date
  const fetchAvailableSlots = async (date) => {
    setIsLoadingSlots(true);
    setAvailableSlots([]);
    
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await axios.get(`${API_URL}/reschedule/available-slots`, {
        params: { date: formattedDate }
      });
      
      setAvailableSlots(response.data.data.slots);
      setIsLoadingSlots(false);
    } catch (error) {
      setIsLoadingSlots(false);
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Failed to fetch available slots. Please try again.',
        variant: 'error'
      });
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    fetchAvailableSlots(date);
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  // Handle reschedule confirmation
  const handleRescheduleConfirmation = async () => {
    if (!selectedConsultation || !selectedSlot) {
      setAlert({
        show: true,
        message: 'Please select a consultation and a time slot',
        variant: 'error'
      });
      return;
    }
    
    setIsRescheduling(true);
    setAlert({ show: false, message: '', variant: 'error' });
    
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const response = await axios.post(`${API_URL}/reschedule/confirm`, {
        consultationId: selectedConsultation.id,
        newDate: formattedDate,
        newStartTime: selectedSlot.startTime,
        newEndTime: selectedSlot.endTime
      });
      
      setRescheduleSuccess(true);
      setIsRescheduling(false);
      setStep(5); // Move to success step
    } catch (error) {
      setIsRescheduling(false);
      setRescheduleError(error.response?.data?.message || 'Failed to reschedule consultation. Please try again.');
    }
  };

  // Handle back button
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Minimum date for date picker (24 hours from now)
  const minDate = addDays(new Date(), 1);

  // Render phone verification step
  const renderPhoneVerification = () => (
    
    <div className="bg-white  shadow-sm ">
      <h1  className="text-md sm:text-2xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-6">
              <span className="text-purple-600">Reshedule  </span> your consultation
            </h1>
      <h3 className="text-gray-500 text-center mb-6 text-lg"><span className='text-purple-600 font-bold'> Step 1: </span>Verify Your Phone Number </h3>
      
      {alert.show && (
        <div className={`p-4 mb-4 rounded-sm ${alert.variant === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-[#984bdf]'}`}>
          {alert.message}
        </div>
      )}
      
      <form onSubmit={handlePhoneVerification}>
        <div className="mb-4 text-left">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            id="phone"
            placeholder="Enter your 10-digit phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#9333ea] ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
          />
          {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Enter the phone number you used when booking the consultation.
          </p>
        </div>
        
        <button 
          type="submit" 
          disabled={isPhoneVerifying}
          className="w-full bg-[#9333ea] hover:bg-[#984bdf] text-white font-medium py-2 px-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isPhoneVerifying ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Verifying...</span>
            </>
          ) : (
            'Verify Phone Number'
          )}
        </button>
      </form>
    </div>
  );

  // Render OTP verification step
  const renderOtpVerification = () => (
    <div className="bg-white  shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Verify OTP</h2>
      <h3 className="text-gray-500 text-center mb-6 text-lg">Step 2: Enter the OTP sent to your email</h3>
      
      <div className="p-4 mb-4 bg-blue-50 text-[#984bdf] rounded-sm">
        We've sent a verification code to your email address: {maskedEmail}
      </div>
      
      <form onSubmit={handleOtpVerification}>
        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
          <input
            type="text"
            id="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#9333ea] ${otpError ? 'border-red-500' : 'border-gray-300'}`}
          />
          {otpError && <p className="mt-1 text-sm text-red-600">{otpError}</p>}
        </div>
        
        <div className="space-y-3">
          <button 
            type="submit" 
            disabled={isOtpVerifying}
            className="w-full bg-[#9333ea] hover:bg-[#984bdf] text-white font-medium py-2 px-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isOtpVerifying ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Verifying...</span>
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
          <button 
            type="button" 
            onClick={handleBack}
            className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:ring-offset-2 transition-colors duration-200"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );

  // Render consultation selection step
  const renderConsultationSelection = () => (
    <div className="bg-white  shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Select Consultation to Reschedule</h2>
      <h3 className="text-gray-500 text-center mb-6 text-lg">Step 3: Choose which consultation you want to reschedule</h3>
      
      {consultations.length === 0 ? (
        <div className="p-4 mb-4 bg-blue-50 text-[#984bdf] rounded-sm">
          No consultations available for rescheduling.
        </div>
      ) : (
        <div className="space-y-3">
          {consultations.map((consultation) => (
            <div 
              key={consultation.id} 
              className="border border-gray-200  p-4 cursor-pointer hover:shadow-sm transition-all duration-200 hover:-translate-y-1"
              onClick={() => handleConsultationSelect(consultation)}
            >
              <div className="flex  items-center justify-between">
                <div className="text-left">
                  <h4 className="text-lg  font-semibold text-[#9333ea]">{consultation.service}</h4>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Date:</span> {consultation.formattedDate}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Time:</span> {consultation.startTime} - {consultation.endTime}
                  </p>
                </div>
                <button className="px-4 py-2 border border-[#9333ea] text-[#9333ea] rounded-sm hover:bg-blue-50 transition-colors duration-200">
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        <button 
          type="button" 
          onClick={handleBack}
          className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:ring-offset-2 transition-colors duration-200"
        >
          Back
        </button>
      </div>
    </div>
  );

  // Render slot selection step
  const renderSlotSelection = () => (
    <div className="bg-white  shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Select New Time Slot</h2>
      <h3 className="text-gray-500 text-center mb-6 text-lg">Step 4: Choose a new date and time</h3>
      
      {alert.show && (
        <div className={`p-4 mb-4 rounded-sm ${alert.variant === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-[#984bdf]'}`}>
          {alert.message}
        </div>
      )}
      
      {selectedConsultation && (
        <div className="p-4 mb-4 bg-[#9233ea2e] text-[#984bdf] rounded-sm">
          <span className="font-semibold">Rescheduling:</span> {selectedConsultation.service} on {selectedConsultation.formattedDate} at {selectedConsultation.startTime}
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={minDate}
          dateFormat="MMMM d, yyyy"
          className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#9333ea]"
          placeholderText="Select a date"
        />
        <p className="mt-1 text-sm text-gray-500">
          You can only reschedule to dates that are at least 24 hours in the future.
        </p>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3">Available Time Slots</h4>
        
        {isLoadingSlots ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-[#9333ea] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading available slots...</p>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="p-4 bg-yellow-50 text-yellow-700 rounded-sm">
            No available slots for the selected date. Please choose another date.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                className={`py-2 px-3 rounded-sm text-sm font-medium mb-2 transition-colors duration-200 ${selectedSlot === slot ? 'bg-[#9333ea] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                onClick={() => handleSlotSelect(slot)}
              >
                {slot.startTime} - {slot.endTime}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <button 
          type="button" 
          onClick={handleRescheduleConfirmation}
          disabled={!selectedSlot || isRescheduling}
          className="w-full bg-[#9333ea] hover:bg-[#7f11e5] text-white font-medium py-2 px-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isRescheduling ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            'Confirm Reschedule'
          )}
        </button>
        <button 
          type="button" 
          onClick={handleBack}
          className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:ring-offset-2 transition-colors duration-200"
        >
          Back
        </button>
      </div>
      
      {rescheduleError && (
        <div className="p-4 mt-4 bg-red-50 text-red-700 rounded-sm">
          {rescheduleError}
        </div>
      )}
    </div>
  );

  // Render success step
  const renderSuccess = () => (
    <div className="bg-white  shadow-sm p-6 text-center">
      <div className="mb-6 text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Consultation Rescheduled Successfully!</h2>
      
      <p className="text-gray-600 mb-6">
        Your consultation has been rescheduled to <span className="font-semibold">{format(selectedDate, 'MMMM d, yyyy')}</span> at <span className="font-semibold">{selectedSlot?.startTime} - {selectedSlot?.endTime}</span>.
      </p>
      
      <button 
        type="button" 
        onClick={() => navigate('/')}
        className="w-full bg-[#9333ea] hover:bg-[#984bdf] text-white font-medium py-2 px-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:ring-offset-2 transition-colors duration-200"
      >
        Return to Home
      </button>
    </div>
  );

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderPhoneVerification();
      case 2:
        return renderOtpVerification();
      case 3:
        return renderConsultationSelection();
      case 4:
        return renderSlotSelection();
      case 5:
        return renderSuccess();
      default:
        return renderPhoneVerification();
    }
  };

  return (
    <div className="py-10 px-4 h-screen flex items-center justify-center">
      
      <div className=" mx-auto max-w-4xl">
        <div className='w-full mb-10 '><img src={logoImg} className='m-auto opacity-70' alt="" /></div>
        {renderStep()}
      </div>
    </div>
  );
};

export default RescheduleConsultaion;