import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Loader size={30} className="text-blue-600 animate-spin mb-4" />
      <p className="text-gray-600">{message}</p>
    </motion.div>
  );
};

export default LoadingState;