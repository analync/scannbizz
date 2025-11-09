import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface ManualEntryModalProps {
  onClose: () => void;
  onConfirm: (barcode: string) => void;
}

const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ onClose, onConfirm }) => {
  const [barcode, setBarcode] = useState('');

  const handleConfirm = () => {
    if (barcode) {
      onConfirm(barcode);
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
        <div className="p-4 bg-primary-500 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold">Enter Barcode</h2>
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
              Barcode
            </label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Enter barcode"
              className="input w-full"
              autoFocus
            />
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

export default ManualEntryModal;
