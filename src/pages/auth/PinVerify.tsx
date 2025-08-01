import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PinVerify: React.FC = () => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyPin, logOut } = useAuth();
  const navigate = useNavigate();

  // Auto-focus the first input on component mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    
    if (!/^\d*$/.test(value)) {
      return;
    }
    
    const updatePin = [...pin];
    updatePin[index] = value;
    setPin(updatePin);
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all digits are filled
    if (value && index === 3) {
      const pinString = [...pin.slice(0, 3), value].join('');
      if (pinString.length === 4) {
        setTimeout(() => {
          handleVerifyPin([...pin.slice(0, 3), value]);
        }, 300);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && !e.currentTarget.value) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedPin = pastedData.slice(0, 4).split('');
    
    if (!/^\d+$/.test(pastedData)) {
      return;
    }
    
    const newPin = Array(4).fill('');
    pastedPin.forEach((digit, i) => {
      if (i < 4) {
        newPin[i] = digit;
      }
    });
    
    setPin(newPin);
    
    // Auto-submit when pasting a complete PIN
    if (pastedData.length >= 4) {
      setTimeout(() => {
        handleVerifyPin(newPin);
      }, 300);
    }
  };

  const handleVerifyPin = async (pinToVerify = pin) => {
    const pinString = pinToVerify.join('');
    
    if (pinString.length !== 4) {
      toast.error('Please enter a 4-digit PIN');
      return;
    }
    
    setLoading(true);
    
    try {
      const isValid = await verifyPin(pinString);
      
      if (isValid) {
        navigate('/');
      } else {
        setError(true);
        setPin(['', '', '', '']);
        
        // Shake animation effect
        setTimeout(() => {
          setError(false);
          inputRefs.current[0]?.focus();
        }, 500);
        
        toast.error('Invalid PIN. Please try again.');
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      toast.error('Failed to verify PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-primary-950">
      <motion.div
        className="glass-card w-full max-w-md p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="mx-auto w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10, delay: 0.2 }}
          >
            <LockKeyhole size={30} />
          </motion.div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Enter PIN
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Please enter your 4-digit PIN to continue
          </p>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={error ? 'error' : 'normal'}
            initial={{ x: error ? -10 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: 0 }}
            transition={error ? { 
              type: 'spring', 
              stiffness: 500, 
              damping: 5,
              repeat: 3,
              repeatType: 'mirror',
              duration: 0.1
            } : {}}
            className="space-y-6"
          >
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={pin[i]}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={(e) => handlePaste(e)}
                  ref={(el) => (inputRefs.current[i] = el)}
                  className={`w-16 h-16 text-center text-2xl font-bold rounded-lg border ${
                    error
                      ? 'border-error-500 dark:border-error-500 bg-error-50 dark:bg-error-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
                  disabled={loading}
                />
              ))}
            </div>
            
            <button
              onClick={() => handleVerifyPin()}
              className="btn btn-primary w-full"
              disabled={pin.join('').length !== 4 || loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <ArrowRight size={18} className="mr-2" />
                  Continue
                </span>
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className="btn btn-ghost w-full text-gray-500 dark:text-gray-400"
              disabled={loading}
            >
              Use a different account
            </button>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PinVerify;