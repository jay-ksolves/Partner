import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import PageSkeleton from '@/components/ui/PageSkeleton';

// Lazy-loaded pages
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Login = React.lazy(() => import('@/pages/auth/Login'));
const Register = React.lazy(() => import('@/pages/auth/Register'));
const Transactions = React.lazy(() => import('@/pages/Transactions'));
const KYC = React.lazy(() => import('@/pages/KYC'));
const PartnerProfile = React.lazy(() => import('@/pages/partners/Profile'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const AdminUsers = React.lazy(() => import('@/pages/admin/Users'));
const AdminReports = React.lazy(() => import('@/pages/admin/Reports'));
const NotFound = React.lazy(() => import('@/pages/errors/NotFound'));
const ServerError = React.lazy(() => import('@/pages/errors/ServerError'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  if (user?.role !== 'admin') {
    return <Navigate to="/403" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && !isAuthenticated) {
        try {
          // Verify token with backend
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const { data } = await response.json();
            dispatch(loginSuccess(data.user));
          } else {
            localStorage.removeItem('accessToken');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('accessToken');
        }
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  return (
    <ErrorBoundary>
      <div className="App">
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } />
            <Route path="/register" element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            } />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="kyc" element={<KYC />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="partners/profile" element={<PartnerProfile />} />
              <Route path="settings" element={<Settings />} />
              
              {/* Admin Routes */}
              <Route path="admin" element={
                <AdminRoute>
                  <div>Admin Layout</div>
                </AdminRoute>
              }>
                <Route path="users" element={<AdminUsers />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>
            </Route>

            {/* Error Routes */}
            <Route path="/500" element={<ServerError />} />
            <Route path="/403" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
                  <p className="text-gray-600">Access Forbidden</p>
                </div>
              </div>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default App;