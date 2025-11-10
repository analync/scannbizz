import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';

interface ShareReceiptModalProps {
  onClose: () => void;
  onSend: (customerNumber: string) => void;
}

const ShareReceiptModal: React.FC<ShareReceiptModalProps> = ({ onClose, onSend }) => {
  const [customerNumber, setCustomerNumber] = useState('');

  const handleSend = () => {
    if (customerNumber.trim()) {
      onSend(customerNumber);
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-card w-full max-w-sm"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="p-4 bg-secondary-500 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold">Share Receipt</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <label htmlFor="customer-number" className="block text-sm font-medium mb-2">
            Customer's WhatsApp Number
          </label>
          <input
            id="customer-number"
            type="tel"
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
            placeholder="e.g., 1234567890"
            className="input w-full"
          />
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="btn btn-outline flex-1">
              Cancel
            </button>
            <button onClick={handleSend} className="btn btn-secondary flex-1">
              <Send size={18} className="mr-1" />
              Send
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareReceiptModal;
