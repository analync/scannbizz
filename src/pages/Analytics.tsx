import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  Package, 
  Calendar,
  RefreshCw,
  LineChart,
  PieChart
} from 'lucide-react';
import { useData, SaleItem } from '../contexts/DataContext';
import SalesChart from '../components/analytics/SalesChart';
import { formatCurrency, formatDate, getDateRangeForPastDays } from '../utils/dateUtils';

interface TopProduct {
  barcode: string;
  name: string;
  quantity: number;
  revenue: number;
}

interface DailySales {
  [date: string]: number;
}

const Analytics: React.FC = () => {
  const { todaySales, loadingData } = useData();
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [dateRange, setDateRange] = useState(7);
  
  // Calculate top-selling products
  const topProducts = React.useMemo(() => {
    const productMap = new Map<string, TopProduct>();
    
    todaySales.forEach(sale => {
      const existing = productMap.get(sale.barcode);
      
      if (existing) {
        existing.quantity += sale.saleQuantity;
        existing.revenue += sale.price * sale.saleQuantity;
      } else {
        productMap.set(sale.barcode, {
          barcode: sale.barcode,
          name: sale.name,
          quantity: sale.saleQuantity,
          revenue: sale.price * sale.saleQuantity
        });
      }
    });
    
    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [todaySales]);
  
  // Create daily sales data for chart
  const dailySales: DailySales = React.useMemo(() => {
    const dates = getDateRangeForPastDays(dateRange);
    const salesByDate: DailySales = {};
    
    // Initialize all dates with 0
    dates.forEach(date => {
      salesByDate[date] = 0;
    });
    
    // Set today's sales
    salesByDate[formatDate(new Date())] = todaySales.reduce(
      (sum, sale) => sum + (sale.price * sale.saleQuantity), 0
    );
    
    return salesByDate;
  }, [todaySales, dateRange]);
  
  // Total revenue from the chart period
  const periodRevenue = Object.values(dailySales).reduce((sum, revenue) => sum + revenue, 0);
  
  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Analytics</h1>
        
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-md ${
              chartType === 'bar'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <BarChart2 size={20} />
          </button>
          
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-md ${
              chartType === 'line'
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <LineChart size={20} />
          </button>
        </div>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Calendar size={16} />
          <span>Last {dateRange} days</span>
        </div>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(parseInt(e.target.value))}
          className="text-sm rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 focus:ring-1 focus:ring-primary-500"
        >
          <option value="7">Last 7 days</option>
          <option value="14">Last 14 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>
      
      <motion.div
        className="card mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {loadingData ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Sales Overview</h2>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total: {formatCurrency(periodRevenue)}
              </span>
            </div>
            
            <SalesChart
              salesData={dailySales}
              days={dateRange}
              chartType={chartType}
              title=""
            />
          </>
        )}
      </motion.div>
      
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Top Selling Products</h2>
          <span className="badge badge-primary">{topProducts.length} Products</span>
        </div>
        
        {loadingData ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : topProducts.length > 0 ? (
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div 
                key={product.barcode}
                className="flex items-center gap-3"
              >
                <div className={`
                  p-2 rounded-full w-8 h-8 flex items-center justify-center 
                  ${index === 0 
                    ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}
                `}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Qty: {product.quantity}</span>
                    <span>|</span>
                    <span>Revenue: {formatCurrency(product.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
            No sales data available yet
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Analytics;