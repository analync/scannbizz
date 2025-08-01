import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Package, 
  Search, 
  Filter,
  AlertTriangle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useData, Product } from '../contexts/DataContext';
import ProductCard from '../components/products/ProductCard';
import ProductForm from '../components/products/ProductForm';
import BarcodeScanner from '../components/scanner/BarcodeScanner';

const Stock: React.FC = () => {
  const { 
    stock, 
    addProduct, 
    updateProduct,
    loadingData 
  } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    lowStock: false,
    recentlyAdded: false
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Filter products based on search term and filters
  const filteredProducts = stock.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.barcode.includes(searchTerm);
    
    if (!matchesSearch) return false;
    
    if (filters.lowStock && product.quantity > 5) return false;
    
    if (filters.recentlyAdded && product.updatedAt) {
      const productDate = new Date(product.updatedAt);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      if (productDate < oneDayAgo) return false;
    }
    
    return true;
  });
  
  // Handle barcode scan for add product
  const handleScan = (barcode: string) => {
    setShowScanner(false);
    
    // Check if product already exists
    const existingProduct = stock.find(p => p.barcode === barcode);
    
    if (existingProduct) {
      setEditingProduct(existingProduct);
    } else {
      setShowAddModal(true);
      // Pre-fill the barcode field
      setEditingProduct({
        barcode,
        name: '',
        price: 0,
        quantity: 0
      });
    }
  };
  
  // Handle add/update product
  const handleSaveProduct = async (product: Omit<Product, 'updatedAt'>) => {
    try {
      if (stock.some(p => p.barcode === product.barcode)) {
        await updateProduct(product as Product);
        toast.success(`Updated ${product.name}`);
      } else {
        await addProduct(product);
        toast.success(`Added ${product.name} to stock`);
      }
      
      setShowAddModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };
  
  // Handle product deletion
  const handleDeleteProduct = async (product: Product) => {
    // Confirm deletion
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        // Set quantity to 0 instead of deleting
        await updateProduct({
          ...product,
          quantity: 0
        });
        toast.success(`${product.name} has been removed from stock`);
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };
  
  // Handle restock product
  const handleRestockProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      lowStock: false,
      recentlyAdded: false
    });
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Stock Management</h1>
        
        <button
          onClick={() => setShowScanner(true)}
          className="btn btn-primary"
        >
          <Plus size={18} className="mr-1" />
          Add Stock
        </button>
      </div>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-10 pr-10"
        />
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
            filters.lowStock || filters.recentlyAdded ? 'text-primary-500' : 'text-gray-400'
          }`}
        >
          <Filter size={18} />
        </button>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 mb-4 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-500 dark:text-primary-400"
              >
                Clear all
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, lowStock: !prev.lowStock }))}
                className={`badge ${
                  filters.lowStock ? 'badge-warning' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                } cursor-pointer flex items-center gap-1`}
              >
                <AlertTriangle size={12} />
                Low Stock
                {filters.lowStock && (
                  <X size={12} className="ml-1" />
                )}
              </button>
              
              <button
                onClick={() => setFilters(prev => ({ ...prev, recentlyAdded: !prev.recentlyAdded }))}
                className={`badge ${
                  filters.recentlyAdded ? 'badge-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                } cursor-pointer flex items-center gap-1`}
              >
                <Package size={12} />
                Recently Added
                {filters.recentlyAdded && (
                  <X size={12} className="ml-1" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {loadingData ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.barcode}
                product={product}
                onEdit={setEditingProduct}
                onDelete={handleDeleteProduct}
                onRestock={handleRestockProduct}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || filters.lowStock || filters.recentlyAdded
              ? "No products match your search criteria"
              : "Your inventory is empty. Add products to get started."}
          </p>
          
          <button
            onClick={() => setShowScanner(true)}
            className="btn btn-primary"
          >
            <Plus size={18} className="mr-1" />
            Add First Product
          </button>
        </div>
      )}
      
      <AnimatePresence>
        {showScanner && (
          <BarcodeScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
            title="Scan Product Barcode"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showAddModal && (
          <ProductForm
            initialData={editingProduct || undefined}
            onSubmit={handleSaveProduct}
            onCancel={() => {
              setShowAddModal(false);
              setEditingProduct(null);
            }}
            title={editingProduct?.barcode ? 'Edit Product' : 'Add Product'}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Stock;