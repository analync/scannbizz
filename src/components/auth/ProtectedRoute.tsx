import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, hasSetupPin } = useAuth();
  const location = useLocation();

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