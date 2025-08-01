import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const StatusBar: React.FC = () => {
  const { storeInfo } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Update current time every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Format time as HH:MM
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="bg-primary-500 text-white py-2 px-4 flex items-center justify-between">
      <div className="text-sm font-semibold truncate">
        {storeInfo.name}
      </div>
      
      <div className="flex items-center gap-2">
        {!isOnline && (
          <div className="flex items-center gap-1 text-white bg-error-500 px-2 py-0.5 rounded-full text-xs">
            <WifiOff size={12} />
            <span>Offline</span>
          </div>
        )}
        <span className="text-sm font-medium">{formattedTime}</span>
      </div>
    </div>
  );
};

export default StatusBar;