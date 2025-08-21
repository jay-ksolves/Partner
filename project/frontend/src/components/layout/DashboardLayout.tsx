import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setShowScrollToTop } from '@/store/slices/uiSlice';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Breadcrumbs from './Breadcrumbs';
import Toast from '../ui/Toast';
import ScrollToTop from '../ui/ScrollToTop';
import FullscreenToggle from '../ui/FullscreenToggle';

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed, theme, showScrollToTop } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Handle scroll to top button visibility
    const handleScroll = () => {
      const shouldShow = window.scrollY > 600;
      if (shouldShow !== showScrollToTop) {
        dispatch(setShowScrollToTop(shouldShow));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, showScrollToTop]);

  return (
    <div className="min-h-screen bg-surface-bg dark:bg-gray-900 transition-colors">
      <div className="flex">
        <Sidebar />
        
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          <Topbar />
          
          <main className="p-6">
            <Breadcrumbs />
            
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <Toast />
      <ScrollToTop />
      <FullscreenToggle />
    </div>
  );
};

export default DashboardLayout;