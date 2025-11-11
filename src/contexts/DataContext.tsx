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
  currentReceipt: SaleItem[];
  storeInfo: StoreInfo;
  loadingData: boolean;
  todayRevenue: number;
  itemsSoldToday: number;
  lowStockItems: Product[];
  addProduct: (product: Omit<Product, 'updatedAt'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  addToReceipt: (barcode: string, quantity: number) => Promise<void>;
  removeFromReceipt: (saleId: string) => Promise<void>;
  updateReceiptItemQuantity: (saleId: string, newQuantity: number) => void;
  confirmPayment: () => Promise<void>;
  clearReceipt: (restoreStock: boolean) => Promise<void>;
  updateStoreInfo: (info: StoreInfo) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [stock, setStock] = useState<Product[]>([]);
  const [todaySales, setTodaySales] = useState<SaleItem[]>([]);
  const [currentReceipt, setCurrentReceipt] = useState<SaleItem[]>([]);
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

  // Add item to current receipt
  const addToReceipt = async (barcode: string, quantity: number) => {
    const product = stock.find(p => p.barcode === barcode);
    if (!product) throw new Error('Product not found in stock');
    if (product.quantity < quantity) throw new Error('Not enough stock');

    setCurrentReceipt(prevReceipt => {
      const existingItem = prevReceipt.find(item => item.barcode === barcode);
      if (existingItem) {
        return prevReceipt.map(item =>
          item.barcode === barcode
            ? { ...item, saleQuantity: item.saleQuantity + quantity }
            : item
        );
      } else {
        const newItem: SaleItem = {
          ...product,
          saleId: `local-${Date.now()}`,
          saleQuantity: quantity,
          saleTime: new Date().toISOString()
        };
        return [...prevReceipt, newItem];
      }
    });
  };

  // Remove item from current receipt
  const removeFromReceipt = async (saleId: string) => {
    setCurrentReceipt(prevReceipt => prevReceipt.filter(item => item.saleId !== saleId));
  };

  // Update item quantity in current receipt
  const updateReceiptItemQuantity = (saleId: string, newQuantity: number) => {
    setCurrentReceipt(prevReceipt => prevReceipt.map(item =>
      item.saleId === saleId ? { ...item, saleQuantity: newQuantity } : item
    ));
  };

  // Confirm payment and save the sale to Firebase
  const confirmPayment = async () => {
    if (!currentUser) throw new Error('No authenticated user');
    if (currentReceipt.length === 0) throw new Error('Receipt is empty');
    
    const uid = currentUser.uid;
    const today = formatDate(new Date());
    const now = new Date().toISOString();
    
    // Create a batch of updates
    const updates: { [key: string]: any } = {};
    let activityLog = 'Sale confirmed: ';

    for (const item of currentReceipt) {
      const productInStock = stock.find(p => p.barcode === item.barcode);
      if (!productInStock) throw new Error(`Product ${item.name} not found`);

      const newQuantity = productInStock.quantity - item.saleQuantity;
      if (newQuantity < 0) throw new Error(`Not enough stock for ${item.name}`);

      // Update stock quantity
      updates[`users/${uid}/stock/${item.barcode}/quantity`] = newQuantity;
      updates[`users/${uid}/stock/${item.barcode}/updatedAt`] = now;
      
      // Add sale record
      const saleRef = push(ref(db, `users/${uid}/sales/${today}`));
      updates[`users/${uid}/sales/${today}/${saleRef.key}`] = {
        ...item,
        saleId: saleRef.key, // Use the Firebase key as the final saleId
        saleTime: now,
      };
      
      activityLog += `${item.name} (x${item.saleQuantity}), `;
    }

    // Perform the batch update
    await update(ref(db), updates);
    await addActivityLog(uid, activityLog.slice(0, -2));

    // Clear the current receipt
    setCurrentReceipt([]);
  };

  // Clear the current receipt (e.g., cancel sale)
  const clearReceipt = async (restoreStock: boolean) => {
    // Since stock is now only updated on confirm, we just need to clear the local receipt.
    // The 'restoreStock' parameter might be useful if we were to optimistically update UI, but not for now.
    setCurrentReceipt([]);
    if (currentUser) {
      await addActivityLog(currentUser.uid, 'Cleared current receipt');
    }
  };

  // Update store info
  const updateStoreInfo = async (info: StoreInfo) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    await set(ref(db, `users/${currentUser.uid}/storeInfo`), info);
    await addActivityLog(currentUser.uid, 'Updated store information');
  };

  const value = {
    stock,
    todaySales,
    currentReceipt,
    storeInfo,
    loadingData,
    todayRevenue,
    itemsSoldToday,
    lowStockItems,
    addProduct,
    updateProduct,
    addToReceipt,
    removeFromReceipt,
    updateReceiptItemQuantity,
    confirmPayment,
    clearReceipt,
    updateStoreInfo,
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