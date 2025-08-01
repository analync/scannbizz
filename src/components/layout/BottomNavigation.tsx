import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Package, ShoppingCart, BarChart2, User } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex flex-col items-center justify-center py-2 px-1 
        relative
        ${isActive 
          ? 'text-primary-500' 
          : 'text-gray-500 dark:text-gray-400'}
      `}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="nav-indicator"
              className="absolute inset-0 bg-primary-50 dark:bg-primary-900/40 rounded-lg"
              transition={{ type: 'spring', duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{icon}</span>
          <span className="text-xs mt-1 font-medium relative z-10">{label}</span>
        </>
      )}
    </NavLink>
  );
};

const BottomNavigation: React.FC = () => {
  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 grid grid-cols-5 shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
    >
      <NavItem to="/" icon={<Home size={20} />} label="Home" />
      <NavItem to="/stock" icon={<Package size={20} />} label="Stock" />
      <NavItem to="/sell" icon={<ShoppingCart size={20} />} label="Sell" />
      <NavItem to="/analytics" icon={<BarChart2 size={20} />} label="Analytics" />
      <NavItem to="/account" icon={<User size={20} />} label="Account" />
    </motion.nav>
  );
};

export default BottomNavigation;