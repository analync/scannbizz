import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  LogOut, 
  Settings, 
  User,
  MapPin,
  Phone,
  Moon,
  Sun,
  LockKeyhole,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useData, StoreInfo } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const Account: React.FC = () => {
  const { currentUser, logOut } = useAuth();
  const { storeInfo, updateStoreInfo, loadingData } = useData();
  const { theme, toggleTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StoreInfo>(storeInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Store name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateStoreInfo(formData);
      toast.success('Store information updated');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating store info:', error);
      toast.error('Failed to update store information');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };
  
  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Account</h1>
      </div>
      
      <motion.div
        className="card mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Store size={20} className="text-primary-500" />
            Store Information
          </h2>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-ghost p-2"
            >
              <Settings size={18} />
            </button>
          )}
        </div>
        
        {loadingData ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-10"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(storeInfo);
                }}
                className="btn btn-outline flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Send size={18} className="mr-2" />
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Store size={20} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Store Name</p>
                <p className="font-medium">{storeInfo.name}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="font-medium">
                  {storeInfo.address || <span className="text-gray-400 italic">Not set</span>}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium">
                  {storeInfo.phone || <span className="text-gray-400 italic">Not set</span>}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      <motion.div
        className="card mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <User size={20} className="text-primary-500" />
          User Account
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User size={20} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="card mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Settings size={20} className="text-primary-500" />
          App Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon size={20} className="text-gray-400" />
              ) : (
                <Sun size={20} className="text-gray-400" />
              )}
              <span>Dark Mode</span>
            </div>
            
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <button
          onClick={handleLogout}
          className="btn btn-outline w-full text-error-600 dark:text-error-400 border-error-300 dark:border-error-700 hover:bg-error-50 dark:hover:bg-error-900/20"
        >
          <LogOut size={18} className="mr-2" />
          Log Out
        </button>
      </motion.div>
    </div>
  );
};

export default Account;