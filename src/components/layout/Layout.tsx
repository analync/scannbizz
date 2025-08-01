import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import StatusBar from './StatusBar';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-full relative">
      <StatusBar />
      
      <motion.main 
        className="flex-1 overflow-y-auto pb-16"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;