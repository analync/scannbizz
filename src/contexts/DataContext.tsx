import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, onValue, set, update, get, push } from 'firebase/database';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { formatDate } from '../utils/dateUtils';
import { addActivityLog } from '../utils/activityLog';

export interface Product {
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  updatedAt?: string;
}

export interface SaleItem extends Product {
  saleId: string;
  saleQuantity: number;
  saleTime: string;
}

export interface StoreInfo {
  name: string;
  address: string;
  phone: string;
}

interface DataContextType {
  stock: Product[];
  todaySales: SaleItem[];
  storeInfo: StoreInfo;
  loadingData: boolean;
  todayRevenue: number;
  itemsSoldToday: number;
  lowStockItems: Product[];
  addProduct: (product: Omit<Product, 'updatedAt'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  sellProduct: (barcode: string, quantity: number) => Promise<void>;
  updateStoreInfo: (info: StoreInfo) => Promise<void>;
  resetDaySales: (restoreStock: boolean) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [stock, setStock] = useState<Product[]>([]);
  const [todaySales, setTodaySales] = useState<SaleItem[]>([]);
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: 'My Store',
    address: '',
    phone: ''
  });
  const [loadingData, setLoadingData] = useState(true);

  // Calculate derived data
  const todayRevenue = todaySales.reduce((sum, item) => 
    sum + (item.price * item.saleQuantity), 0);
  
  const itemsSoldToday = todaySales.reduce((sum, item) => 
    sum + item.saleQuantity, 0);
  
  const lowStockItems = stock.filter(item => item.quantity <= 5);

  // Load store data from Firebase
  useEffect(() => {
    if (!currentUser) {
      setStock([]);
      setTodaySales([]);
      setStoreInfo({
        name: 'My Store',
        address: '',
        phone: ''
      });
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    const uid = currentUser.uid;
    const today = formatDate(new Date());

    // Load store info
    const storeInfoRef = ref(db, `users/${uid}/storeInfo`);
    const storeInfoUnsubscribe = onValue(storeInfoRef, (snapshot) => {
      if (snapshot.exists()) {
        setStoreInfo(snapshot.val());
      }
    });

    // Load stock data
    const stockRef = ref(db, `users/${uid}/stock`);
    const stockUnsubscribe = onValue(stockRef, (snapshot) => {
      if (snapshot.exists()) {
        const stockData = snapshot.val();
        const stockArray = Object.keys(stockData).map(barcode => ({
          barcode,
          ...stockData[barcode]
        }));
        setStock(stockArray);
      } else {
        setStock([]);
      }
    });

    // Load today's sales
    const todaySalesRef = ref(db, `users/${uid}/sales/${today}`);
    const salesUnsubscribe = onValue(todaySalesRef, (snapshot) => {
      if (snapshot.exists()) {
        const salesData = snapshot.val();
        const salesArray = Object.keys(salesData).map(saleId => ({
          saleId,
          ...salesData[saleId]
        }));
        setTodaySales(salesArray);
      } else {
        setTodaySales([]);
      }
      setLoadingData(false);
    });

    return () => {
      storeInfoUnsubscribe();
      stockUnsubscribe();
      salesUnsubscribe();
    };
  }, [currentUser]);

  // Add a new product to stock
  const addProduct = async (product: Omit<Product, 'updatedAt'>) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    const now = new Date().toISOString();
    const productWithTimestamp = {
      ...product,
      updatedAt: now
    };
    
    await set(ref(db, `users/${currentUser.uid}/stock/${product.barcode}`), productWithTimestamp);
    await addActivityLog(currentUser.uid, `Added ${product.name} to stock`);
  };

  // Update an existing product
  const updateProduct = async (product: Product) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    const now = new Date().toISOString();
    const updatedProduct = {
      ...product,
      updatedAt: now
    };
    
    await update(ref(db, `users/${currentUser.uid}/stock/${product.barcode}`), updatedProduct);
    await addActivityLog(currentUser.uid, `Updated ${product.name}`);
  };

  // Sell a product
  const sellProduct = async (barcode: string, quantity: number) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    // Find the product in stock
    const product = stock.find(p => p.barcode === barcode);
    if (!product) throw new Error('Product not found');
    if (product.quantity < quantity) throw new Error('Not enough stock');
    
    const uid = currentUser.uid;
    const today = formatDate(new Date());
    const now = new Date().toISOString();
    
    // Update the stock quantity
    const newQuantity = product.quantity - quantity;
    await update(ref(db, `users/${uid}/stock/${barcode}`), {
      quantity: newQuantity,
      updatedAt: now
    });
    
    // Record the sale
    const saleRef = push(ref(db, `users/${uid}/sales/${today}`));
    await set(saleRef, {
      barcode,
      name: product.name,
      price: product.price,
      saleQuantity: quantity,
      saleTime: now
    });
    
    await addActivityLog(uid, `Sold ${product.name} x${quantity}`);
  };

  // Update store info
  const updateStoreInfo = async (info: StoreInfo) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    await set(ref(db, `users/${currentUser.uid}/storeInfo`), info);
    await addActivityLog(currentUser.uid, 'Updated store information');
  };

  // Reset day's sales
  const resetDaySales = async (restoreStock: boolean) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    const uid = currentUser.uid;
    const today = formatDate(new Date());
    
    // If we need to restore stock
    if (restoreStock && todaySales.length > 0) {
      // Group sales by barcode and sum quantities
      const salesByBarcode = todaySales.reduce<Record<string, number>>((acc, sale) => {
        acc[sale.barcode] = (acc[sale.barcode] || 0) + sale.saleQuantity;
        return acc;
      }, {});
      
      // Update stock for each barcode
      const updatePromises = Object.entries(salesByBarcode).map(async ([barcode, quantity]) => {
        const productRef = ref(db, `users/${uid}/stock/${barcode}`);
        const snapshot = await get(productRef);
        
        if (snapshot.exists()) {
          const product = snapshot.val();
          await update(productRef, {
            quantity: product.quantity + quantity,
            updatedAt: new Date().toISOString()
          });
        }
      });
      
      await Promise.all(updatePromises);
    }
    
    // Clear today's sales
    await set(ref(db, `users/${uid}/sales/${today}`), null);
    await addActivityLog(uid, `Reset sales${restoreStock ? ' and restored stock' : ''}`);
  };

  const value = {
    stock,
    todaySales,
    storeInfo,
    loadingData,
    todayRevenue,
    itemsSoldToday,
    lowStockItems,
    addProduct,
    updateProduct,
    sellProduct,
    updateStoreInfo,
    resetDaySales
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};