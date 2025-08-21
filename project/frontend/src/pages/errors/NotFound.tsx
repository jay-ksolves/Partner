import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-bg via-purple-50 to-sky-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-sky-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gradient-primary mb-4">404</div>
          <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto"></div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all shadow-purple"
          >
            <Home size={20} className="mr-2" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;