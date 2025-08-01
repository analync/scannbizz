import React from 'react';
import { motion } from 'framer-motion';
import { Package, Edit, Trash2, Plus } from 'lucide-react';
import { Product } from '../../contexts/DataContext';
import { formatCurrency } from '../../utils/dateUtils';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onRestock: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onRestock
}) => {
  const isLowStock = product.quantity <= 5;
  
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isLowStock ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'}`}>
          <Package size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(product.price)}
            </span>
            
            <span className="text-sm text-gray-500 dark:text-gray-400">
              |
            </span>
            
            <div className={`text-sm font-medium flex items-center gap-1 ${
              isLowStock 
                ? 'text-warning-600 dark:text-warning-400' 
                : 'text-success-600 dark:text-success-400'
            }`}>
              {isLowStock ? (
                <span className="animate-pulse">Low Stock: {product.quantity}</span>
              ) : (
                <span>In Stock: {product.quantity}</span>
              )}
            </div>
          </div>
          
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onEdit(product)}
              className="p-1.5 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Edit size={16} />
            </button>
            
            <button
              onClick={() => onDelete(product)}
              className="p-1.5 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Trash2 size={16} />
            </button>
            
            <button
              onClick={() => onRestock(product)}
              className="p-1.5 text-gray-500 hover:text-success-500 dark:text-gray-400 dark:hover:text-success-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;