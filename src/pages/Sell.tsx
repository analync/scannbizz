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
    todaySales,
    sellProduct, 
    resetDaySales,
    loadingData 
  } = useData();
  
  const [showScanner, setShowScanner] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [restoreStock, setRestoreStock] = useState(true);
  
  // Calculate total
  const total = todaySales.reduce((sum, item) => 
    sum + (item.price * item.saleQuantity), 0);
  
  // Handle barcode scan for selling
  const handleScan = async (barcode: string) => {
    try {
      // Find the product in stock
      const product = stock.find(p => p.barcode === barcode);
      
      if (!product) {
        toast.error('Product not found in inventory');
        return;
      }
      
      if (product.quantity <= 0) {
        toast.error(`${product.name} is out of stock`);
        return;
      }
      
      // Sell the product (quantity 1)
      await sellProduct(barcode, 1);
      
      // Keep scanner open for multiple scans
      // Don't close the scanner automatically
    } catch (error) {
      console.error('Error selling product:', error);
      toast.error('Failed to process sale');
      setShowScanner(false);
    }
  };
  
  // Handle removing item from receipt
  const handleRemoveItem = async (item: SaleItem) => {
    try {
      // Find the product in stock
      const product = stock.find(p => p.barcode === item.barcode);
      
      if (!product) {
        toast.error('Product not found in inventory');
        return;
      }
      
      // Add the quantity back to stock
      await sellProduct(item.barcode, -item.saleQuantity);
      
      toast.success(`${item.name} removed from receipt`);
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };
  
  // Handle sending receipt to WhatsApp
  const handleSendToWhatsApp = () => {
    if (todaySales.length === 0) {
      toast.error('No items in the receipt');
      return;
    }
    
    // Format receipt
    let receiptText = "📝 *RECEIPT*\n\n";
    
    // Add items
    todaySales.forEach((item, index) => {
      receiptText += `${index + 1}. ${item.name}\n`;
      receiptText += `   ${item.saleQuantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.saleQuantity)}\n`;
    });
    
    // Add total
    receiptText += "\n-----------------------\n";
    receiptText += `*TOTAL: ${formatCurrency(total)}*\n\n`;
    
    // Add timestamp
    receiptText += `Date: ${new Date().toLocaleString()}\n`;
    receiptText += "Thank you for your purchase!";
    
    // Open WhatsApp
    window.open(`https://wa.me/?text=${encodeURIComponent(receiptText)}`);
  };
  
  // Handle reset sales
  const handleResetSales = async () => {
    try {
      await resetDaySales(restoreStock);
      toast.success(`Sales reset${restoreStock ? ' and stock restored' : ''}`);
      setShowResetConfirm(false);
    } catch (error) {
      console.error('Error resetting sales:', error);
      toast.error('Failed to reset sales');
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
          <h2 className="text-lg font-semibold">Receipt</h2>
          <span className="badge badge-primary">{todaySales.length} Items</span>
        </div>
        
        {loadingData ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : todaySales.length > 0 ? (
          <div className="space-y-1 max-h-64 overflow-y-auto mb-4">
            <AnimatePresence>
              {todaySales.map(item => (
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
            No items in receipt yet
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold">{formatCurrency(total)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="btn btn-outline"
              disabled={todaySales.length === 0}
            >
              <RotateCcw size={18} className="mr-1" />
              Reset
            </button>
            
            <button
              onClick={handleSendToWhatsApp}
              className="btn btn-primary"
              disabled={todaySales.length === 0}
            >
              <Send size={18} className="mr-1" />
              Share
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
        {showResetConfirm && (
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
                <h2 className="text-lg font-semibold">Reset Sales</h2>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 text-warning-600 dark:text-warning-400">
                  <AlertTriangle size={24} />
                  <p className="font-medium">Are you sure you want to reset today's sales?</p>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This action will clear all items from the current receipt.
                </p>
                
                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={restoreStock}
                      onChange={(e) => setRestoreStock(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Restore items to inventory</span>
                  </label>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleResetSales}
                    className="btn btn-warning flex-1"
                  >
                    Reset Sales
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