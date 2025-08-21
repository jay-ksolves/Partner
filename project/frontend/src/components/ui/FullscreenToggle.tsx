import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Maximize, Minimize } from 'lucide-react';
import screenfull from 'screenfull';
import { RootState } from '@/store';
import { setFullscreen } from '@/store/slices/uiSlice';

const FullscreenToggle: React.FC = () => {
  const dispatch = useDispatch();
  const { isFullscreen } = useSelector((state: RootState) => state.ui);

  React.useEffect(() => {
    if (screenfull.isEnabled) {
      const handleChange = () => {
        dispatch(setFullscreen(screenfull.isFullscreen));
      };

      screenfull.on('change', handleChange);
      return () => screenfull.off('change', handleChange);
    }
  }, [dispatch]);

  const toggleFullscreen = async () => {
    if (screenfull.isEnabled) {
      try {
        await screenfull.toggle();
      } catch (error) {
        console.error('Fullscreen toggle failed:', error);
      }
    }
  };

  if (!screenfull.isEnabled) return null;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={toggleFullscreen}
      className="fixed bottom-8 left-8 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? (
        <Minimize size={20} className="text-gray-600 dark:text-gray-400" />
      ) : (
        <Maximize size={20} className="text-gray-600 dark:text-gray-400" />
      )}
    </motion.button>
  );
};

export default FullscreenToggle;