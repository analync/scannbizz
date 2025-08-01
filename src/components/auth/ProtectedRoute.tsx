import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, hasSetupPin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login\" state={{ from: location }} replace />;
  }
  
  // If user hasn't set up PIN, redirect to PIN setup
  if (!hasSetupPin) {
    return <Navigate to="/pin-setup\" state={{ from: location }} replace />;
  }
  
  // If user is logged in and has set up PIN, render children
  return <>{children}</>;
};

export default ProtectedRoute;