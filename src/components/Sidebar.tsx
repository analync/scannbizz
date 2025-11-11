import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">ScannBiz</div>
      <nav className="flex-grow">
        <NavLink to="/" className="flex items-center p-4 hover:bg-gray-700">
          <LayoutDashboard className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/sell" className="flex items-center p-4 hover:bg-gray-700">
          <ShoppingCart className="mr-3" />
          Sell
        </NavLink>
        <NavLink to="/inventory" className="flex items-center p-4 hover:bg-gray-700">
          <Package className="mr-3" />
          Inventory
        </NavLink>
        <NavLink to="/settings" className="flex items-center p-4 hover:bg-gray-700">
          <Settings className="mr-3" />
          Settings
        </NavLink>
      </nav>
      <div className="p-4">
        <button onClick={logout} className="flex items-center p-4 w-full text-left hover:bg-gray-700">
          <LogOut className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
