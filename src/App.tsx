import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import PinSetup from './pages/auth/PinSetup';
import PinVerify from './pages/auth/PinVerify';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Stock from './pages/Stock';
import Sell from './pages/Sell';
import Analytics from './pages/Analytics';
import Account from './pages/Account';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <Toaster position="top-center" richColors />
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pin-setup" element={<PinSetup />} />
              <Route path="/pin-verify" element={<PinVerify />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Home />} />
                <Route path="stock" element={<Stock />} />
                <Route path="sell" element={<Sell />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="account" element={<Account />} />
              </Route>
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/\" replace />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;