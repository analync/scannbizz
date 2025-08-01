import { Product, SaleItem, StoreInfo } from '../contexts/DataContext';

// Local storage keys
const KEYS = {
  STOCK: 'scannbizz_stock',
  SALES: 'scannbizz_sales',
  STORE_INFO: 'scannbizz_store_info',
  PENDING_ACTIONS: 'scannbizz_pending_actions',
  LAST_SYNC: 'scannbizz_last_sync'
};

// Types for pending actions
type ActionType = 'ADD_PRODUCT' | 'UPDATE_PRODUCT' | 'SELL_PRODUCT' | 'UPDATE_STORE' | 'RESET_SALES';

interface PendingAction {
  type: ActionType;
  data: any;
  timestamp: number;
}

// Save stock data to local storage
export const saveStockOffline = (stock: Product[]): void => {
  localStorage.setItem(KEYS.STOCK, JSON.stringify(stock));
  localStorage.setItem(KEYS.LAST_SYNC, Date.now().toString());
};

// Save sales data to local storage
export const saveSalesOffline = (sales: SaleItem[]): void => {
  localStorage.setItem(KEYS.SALES, JSON.stringify(sales));
};

// Save store info to local storage
export const saveStoreInfoOffline = (storeInfo: StoreInfo): void => {
  localStorage.setItem(KEYS.STORE_INFO, JSON.stringify(storeInfo));
};

// Get stock data from local storage
export const getOfflineStock = (): Product[] => {
  const stockData = localStorage.getItem(KEYS.STOCK);
  return stockData ? JSON.parse(stockData) : [];
};

// Get sales data from local storage
export const getOfflineSales = (): SaleItem[] => {
  const salesData = localStorage.getItem(KEYS.SALES);
  return salesData ? JSON.parse(salesData) : [];
};

// Get store info from local storage
export const getOfflineStoreInfo = (): StoreInfo | null => {
  const storeData = localStorage.getItem(KEYS.STORE_INFO);
  return storeData ? JSON.parse(storeData) : null;
};

// Add a pending action to be synced when online
export const addPendingAction = (type: ActionType, data: any): void => {
  const pendingActions = getPendingActions();
  pendingActions.push({
    type,
    data,
    timestamp: Date.now()
  });
  localStorage.setItem(KEYS.PENDING_ACTIONS, JSON.stringify(pendingActions));
};

// Get all pending actions
export const getPendingActions = (): PendingAction[] => {
  const actionsData = localStorage.getItem(KEYS.PENDING_ACTIONS);
  return actionsData ? JSON.parse(actionsData) : [];
};

// Clear pending actions after successful sync
export const clearPendingActions = (): void => {
  localStorage.setItem(KEYS.PENDING_ACTIONS, JSON.stringify([]));
};

// Check if we have offline data that needs to be synced
export const hasOfflineData = (): boolean => {
  return getPendingActions().length > 0;
};

// Get last sync time
export const getLastSyncTime = (): number => {
  const time = localStorage.getItem(KEYS.LAST_SYNC);
  return time ? parseInt(time) : 0;
};

// Calculate if we're due for a sync (e.g., every hour)
export const isDueForSync = (intervalMs: number = 3600000): boolean => {
  const lastSync = getLastSyncTime();
  return Date.now() - lastSync > intervalMs;
};