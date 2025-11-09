import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { SaleItem } from '../../contexts/DataContext';
import { formatCurrency } from '../../utils/dateUtils';

interface ReceiptItemProps {
  item: SaleItem;
  onRemove: (item: SaleItem) => void;
  onUpdateQuantity: (item: SaleItem, newQuantity: number) => void;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  const subtotal = item.price * item.saleQuantity;
  
  return (
    <motion.div 
      className="py-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {item.name}
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {formatCurrency(subtotal)}
          </p>
        </div>
        
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <button onClick={() => onUpdateQuantity(item, item.saleQuantity - 1)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <Minus size={12} />
            </button>
            <span>{item.saleQuantity}</span>
            <button onClick={() => onUpdateQuantity(item, item.saleQuantity + 1)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <Plus size={12} />
            </button>
          </div>
          <p>x {formatCurrency(item.price)}</p>
        </div>
      </div>
      
      <button
        onClick={() => onRemove(item)}
        className="p-1.5 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
};

export default ReceiptItem;