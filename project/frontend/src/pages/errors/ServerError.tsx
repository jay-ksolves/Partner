import React from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

const ServerError: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-bg via-purple-50 to-sky-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-sky-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle size={48} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">500</div>
          <div className="w-24 h-1 bg-red-600 dark:bg-red-400 rounded-full mx-auto"></div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're experiencing some technical difficulties. Our team has been notified and we're working to fix the issue.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleReload}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-all shadow-purple"
          >
            <RefreshCw size={20} className="mr-2" />
            Try Again
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <Home size={20} className="mr-2" />
            Go to Dashboard
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            <strong>Still having issues?</strong> Please contact our support team with error code: {Date.now().toString(36).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;