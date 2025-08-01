import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LockKeyhole, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PinSetup: React.FC = () => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { setupPin } = useAuth();
  const navigate = useNavigate();

  const handlePinChange = (index: number, value: string, isConfirm: boolean = false) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    
    if (!/^\d*$/.test(value)) {
      return;
    }
    
    const updatePin = isConfirm ? [...confirmPin] : [...pin];
    updatePin[index] = value;
    
    if (isConfirm) {
      setConfirmPin(updatePin);
    } else {
      setPin(updatePin);
    }
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextIndex = index + 1;
      const refs = isConfirm ? confirmRefs.current : inputRefs.current;
      refs[nextIndex]?.focus();
    }
  };

  const handleKeyDown = (
    index: number, 
    e: React.KeyboardEvent<HTMLInputElement>,
    isConfirm: boolean = false
  ) => {
    if (e.key === 'Backspace' && index > 0 && !e.currentTarget.value) {
      const refs = isConfirm ? confirmRefs.current : inputRefs.current;
      refs[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    isConfirm: boolean = false
  ) => {
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
    
    if (isConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
    }
  };

  const goToConfirmStep = () => {
    if (pin.join('').length !== 4) {
      toast.error('Please enter a 4-digit PIN');
      return;
    }
    
    setStep('confirm');
    setTimeout(() => {
      confirmRefs.current[0]?.focus();
    }, 100);
  };

  const handleSetupPin = async () => {
    const pinString = pin.join('');
    const confirmPinString = confirmPin.join('');
    
    if (pinString !== confirmPinString) {
      toast.error('PINs do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      await setupPin(pinString);
      toast.success('PIN set up successfully!');
      navigate('/');
    } catch (error) {
      console.error('PIN setup error:', error);
      toast.error('Failed to set up PIN. Please try again.');
    } finally {
      setLoading(false);
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
            {step === 'create' ? 'Create PIN' : 'Confirm PIN'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {step === 'create' 
              ? 'Set up a 4-digit PIN for secure access' 
              : 'Please re-enter your PIN to confirm'}
          </p>
        </div>
        
        {step === 'create' ? (
          <div className="space-y-6">
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
                  className="w-16 h-16 text-center text-2xl font-bold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  autoFocus={i === 0}
                />
              ))}
            </div>
            
            <button
              onClick={goToConfirmStep}
              className="btn btn-primary w-full"
              disabled={pin.join('').length !== 4}
            >
              Next
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={confirmPin[i]}
                  onChange={(e) => handlePinChange(i, e.target.value, true)}
                  onKeyDown={(e) => handleKeyDown(i, e, true)}
                  onPaste={(e) => handlePaste(e, true)}
                  ref={(el) => (confirmRefs.current[i] = el)}
                  className="w-16 h-16 text-center text-2xl font-bold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  autoFocus={i === 0}
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep('create');
                  setConfirmPin(['', '', '', '']);
                }}
                className="btn btn-outline flex-1"
                disabled={loading}
              >
                Back
              </button>
              
              <button
                onClick={handleSetupPin}
                className="btn btn-primary flex-1"
                disabled={confirmPin.join('').length !== 4 || loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting PIN...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Check size={18} className="mr-2" />
                    Confirm PIN
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PinSetup;