import React from 'react';
import { motion } from 'framer-motion';
import logoImg from './Landing page/assets/Logo.png';

const LoadingSpinner = () => {
  const logoVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      opacity: [0.4, 0.8, 0.4],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    animate: {
      opacity: [0, 1],
      y: [10, 0],
      transition: {
        duration: 1,
        delay: 0.5
      }
    }
  };

  return (
    <div className="loading-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#fff'
    }}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div
          variants={glowVariants}
          animate="animate"
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 70%)',
            zIndex: 0
          }}
        />
        <motion.img 
          src={logoImg}
          alt="Ineffa Logo"
          variants={logoVariants}
          animate="animate"
          style={{ 
            width: '100px', 
            height: 'auto',
            zIndex: 1,
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
          }}
        />
      </div>
      <motion.p
        variants={textVariants}
        animate="animate"
        style={{
          marginTop: '20px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#333',
          letterSpacing: '1px'
        }}
      >
        Loading amazing experiences...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner; 