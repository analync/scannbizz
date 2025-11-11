import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Scan, 
  Trash2, 
  Send,
  RotateCcw,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { useData, SaleItem } from '../contexts/DataContext';
import BarcodeScanner from '../components/scanner/BarcodeScanner';
import ReceiptItem from '../components/sales/ReceiptItem';
import { formatCurrency } from '../utils/dateUtils';

const Sell: React.FC = () => {
  const {
    stock,
    currentReceipt,
    addToReceipt,
    removeFromReceipt,
    confirmPayment,
    clearReceipt,
    loadingData
  } = useData();
  
  const [showScanner, setShowScanner] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [restoreStock, setRestoreStock] = useState(true);

  // Calculate total
  const total = currentReceipt.reduce((sum, item) =>
    sum + (item.price * item.saleQuantity), 0);
  
  // Handle barcode scan for selling
  const handleScan = async (barcode: string) => {
    try {
      await addToReceipt(barcode, 1);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Expose for testing
  useEffect(() => {
    if (import.meta.env.DEV) {
      (window as any).handleScan = handleScan;
    }
  }, [handleScan]);
  
  // Handle removing item from receipt
  const handleRemoveItem = async (item: SaleItem) => {
    try {
      await removeFromReceipt(item.saleId);
      toast.success(`${item.name} removed from receipt`);
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };
  
  // Handle confirming the payment
  const handleConfirmPayment = async () => {
    if (currentReceipt.length === 0) {
      toast.error('No items in the receipt');
      return;
    }
    
    try {
      await confirmPayment();
      toast.success('Payment confirmed and sale recorded');
      // Receipt is cleared automatically in the context
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Failed to confirm payment');
    }
  };

  // Handle clearing the receipt
  const handleClearReceipt = async () => {
    try {
      await clearReceipt(restoreStock);
      toast.success('Receipt cleared');
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Error clearing receipt:', error);
      toast.error('Failed to clear receipt');
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sell Products</h1>
        
        <button
          onClick={() => setShowScanner(true)}
          className="btn btn-accent"
        >
          <Scan size={18} className="mr-1" />
          Scan to Sell
        </button>
      </div>
      
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Current Receipt</h2>
          <span className="badge badge-primary">{currentReceipt.length} Items</span>
        </div>
        
        {loadingData ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : currentReceipt.length > 0 ? (
          <div className="space-y-1 max-h-64 overflow-y-auto mb-4">
            <AnimatePresence>
              {currentReceipt.map(item => (
                <ReceiptItem
                  key={item.saleId}
                  item={item}
                  onRemove={handleRemoveItem}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
            No items in receipt yet. Scan a product to start.
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold">{formatCurrency(total)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="btn btn-outline"
              disabled={currentReceipt.length === 0}
            >
              <Trash2 size={18} className="mr-1" />
              Clear
            </button>
            
            <button
              onClick={handleConfirmPayment}
              className="btn btn-primary"
              disabled={currentReceipt.length === 0}
            >
              <CheckSquare size={18} className="mr-1" />
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
      
      <div className="card bg-gradient-to-r from-primary-500 to-accent-500 text-white">
        <h3 className="font-semibold mb-2">Quick Tip</h3>
        <p className="text-sm opacity-90">
          Keep the scanner open to scan multiple items in succession. 
          Each scan will automatically add the item to the receipt.
        </p>
      </div>
      
      <AnimatePresence>
        {showScanner && (
          <BarcodeScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
            title="Scan to Sell"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showClearConfirm && (
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
              <div className="p-4 bg-warning-500 text-white flex items-center justify-between">
                <h2 className="text-lg font-semibold">Clear Receipt</h2>
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4 text-warning-600 dark:text-warning-400">
                  <AlertTriangle size={24} className="flex-shrink-0 mt-1" />
                  <p className="font-medium">Are you sure you want to clear the current receipt?</p>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This will remove all items from the receipt. This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleClearReceipt}
                    className="btn btn-warning flex-1"
                  >
                    Clear Receipt
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sell;