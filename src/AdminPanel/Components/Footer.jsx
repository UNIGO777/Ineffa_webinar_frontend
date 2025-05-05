import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer 
      className="bg-white border-t border-gray-200 py-5 px-6 text-gray-600 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="flex items-center justify-center md:justify-start">
              &copy; {currentYear} Ineffa. Made with <Heart size={14} className="mx-1 text-red-500 fill-current" /> by Ineffa Team
            </p>
          </div>
          
         
          
         
        </div>
        
        
      </div>
    </motion.footer>
  );
};

export default Footer;