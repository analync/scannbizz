import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../contexts/DataContext';
import { X } from 'lucide-react';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Omit<Product, 'updatedAt'>) => void;
  onCancel: () => void;
  title: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  title
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    barcode: '',
    name: '',
    price: 0,
    quantity: 0,
    ...initialData
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Convert numeric inputs to numbers
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.barcode) {
      newErrors.barcode = 'Barcode is required';
    }
    
    if (!formData.name) {
      newErrors.name = 'Product name is required';
    }
    
    if (typeof formData.price !== 'number' || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (typeof formData.quantity !== 'number' || formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit({
      barcode: formData.barcode!,
      name: formData.name!,
      price: formData.price as number,
      quantity: formData.quantity as number
    });
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="glass-card w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 bg-primary-500 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button 
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Barcode
              </label>
              <input
                type="text"
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className={`input-field ${errors.barcode ? 'border-error-500 dark:border-error-500' : ''}`}
                disabled={!!initialData.barcode}
              />
              {errors.barcode && (
                <p className="mt-1 text-sm text-error-500">{errors.barcode}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'border-error-500 dark:border-error-500' : ''}`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-500">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`input-field ${errors.price ? 'border-error-500 dark:border-error-500' : ''}`}
                min="0"
                step="0.01"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-error-500">{errors.price}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`input-field ${errors.quantity ? 'border-error-500 dark:border-error-500' : ''}`}
                min="0"
                step="1"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-error-500">{errors.quantity}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProductForm;