import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface QuantityInputModalProps {
  productName: string;
  onClose: () => void;
  onAdd: (quantity: number) => void;
}

const QuantityInputModal: React.FC<QuantityInputModalProps> = ({ productName, onClose, onAdd }) => {
  const [quantity, setQuantity] = useState('1');

  const handleAdd = () => {
    const numQuantity = parseInt(quantity, 10);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }
    onAdd(numQuantity);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-card w-full max-w-xs"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="p-4 bg-secondary-500 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold">{productName}</h2>
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
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
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
              onClick={handleAdd}
              className="btn btn-secondary flex-1"
            >
              <Plus size={18} className="mr-1" />
              Add
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuantityInputModal;
