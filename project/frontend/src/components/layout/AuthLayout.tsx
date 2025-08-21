import React from 'react';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-bg via-purple-50 to-sky-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-sky-900/20">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-purple">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Partner Platform
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Secure partner management system
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-card p-8">
            {children}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;