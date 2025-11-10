import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Check, DollarSign, User } from 'lucide-react';
import { formatCurrency } from '../../utils/dateUtils';

interface ConfirmSaleModalProps {
  total: number;
  onClose: () => void;
  onConfirm: (amountGiven: number, change: number) => void;
}

const ConfirmSaleModal: React.FC<ConfirmSaleModalProps> = ({ total, onClose, onConfirm }) => {
  const [amountGiven, setAmountGiven] = useState('');

  const change = useMemo(() => {
    const given = parseFloat(amountGiven);
    if (isNaN(given) || given < total) {
      return 0;
    }
    return given - total;
  }, [amountGiven, total]);

  const handleConfirm = () => {
    const given = parseFloat(amountGiven);
    if (isNaN(given) || given < total) {
      alert('Amount given must be greater than or equal to the total.');
      return;
    }
    onConfirm(given, change);
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
        <div className="p-4 bg-primary-500 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold">Confirm Sale</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount Given
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                value={amountGiven}
                onChange={(e) => setAmountGiven(e.target.value)}
                placeholder="Enter amount given"
                className="input pl-10 w-full"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">Total:</span>
              <span className="font-bold">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">Change:</span>
              <span className="font-bold text-green-500">{formatCurrency(change)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="btn btn-primary flex-1"
            >
              <Check size={18} className="mr-1" />
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmSaleModal;
