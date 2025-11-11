import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between md:hidden">
      <div className="text-xl font-bold">ScannBiz</div>
      <button onClick={onMenuClick} className="p-2 rounded-md hover:bg-gray-100">
        <Menu />
      </button>
    </header>
  );
};

export default Header;
