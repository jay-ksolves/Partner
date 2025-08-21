import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { RootState } from '@/store';
import { removeToast } from '@/store/slices/uiSlice';

const Toast: React.FC = () => {
  const dispatch = useDispatch();
  const { toasts } = useSelector((state: RootState) => state.ui);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-green-600" />;
      case 'error': return <XCircle size={20} className="text-red-600" />;
      case 'warning': return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'info': return <Info size={20} className="text-blue-600" />;
      default: return <Info size={20} className="text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  React.useEffect(() => {
    toasts.forEach(toast => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`
              max-w-sm w-full border rounded-lg shadow-lg p-4
              ${getBgColor(toast.type)}
            `}
          >
            <div className="flex items-start space-x-3">
              {getIcon(toast.type)}
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-sm text-gray-600 mt-1">
                    {toast.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => dispatch(removeToast(toast.id))}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;