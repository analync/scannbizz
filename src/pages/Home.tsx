import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../utils/dateUtils';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}> = ({ title, value, icon, color, onClick }) => {
  return (
    <motion.div
      className={`card cursor-pointer ${onClick ? 'hover:shadow-lg active:scale-95' : ''}`}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ActionButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}> = ({ label, icon, color, onClick }) => {
  return (
    <motion.button
      className={`flex items-center gap-3 p-4 rounded-xl ${color} w-full`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="p-2 bg-white/20 rounded-lg">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      <ChevronRight className="ml-auto" size={18} />
    </motion.button>
  );
};

const Home: React.FC = () => {
  const { 
    todayRevenue, 
    itemsSoldToday, 
    lowStockItems,
    loadingData
  } = useData();
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(todayRevenue)}
          icon={<TrendingUp size={20} className="text-primary-600 dark:text-primary-400" />}
          color="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
          onClick={() => navigate('/analytics')}
        />
        
        <StatCard
          title="Items Sold"
          value={itemsSoldToday}
          icon={<ShoppingCart size={20} className="text-secondary-600 dark:text-secondary-400" />}
          color="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400"
          onClick={() => navigate('/analytics')}
        />
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
          <span className={`badge ${lowStockItems.length > 0 ? 'badge-warning' : 'badge-success'}`}>
            {lowStockItems.length} Items
          </span>
        </div>
        
        {loadingData ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : lowStockItems.length > 0 ? (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {lowStockItems.map(item => (
              <div key={item.barcode} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400">
                    <AlertTriangle size={16} />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-warning-600 dark:text-warning-400 font-medium">
                  {item.quantity} left
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500 dark:text-gray-400">
            All items are well-stocked
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4 mt-6">
        <ActionButton
          label="Add Stock"
          icon={<Package size={20} />}
          color="bg-primary-500 text-white"
          onClick={() => navigate('/stock')}
        />
        
        <ActionButton
          label="Sell Products"
          icon={<ShoppingCart size={20} />}
          color="bg-accent-500 text-white"
          onClick={() => navigate('/sell')}
        />
      </div>
    </div>
  );
};

export default Home;