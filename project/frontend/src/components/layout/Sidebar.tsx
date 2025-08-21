import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShieldCheck,
  ReceiptIndianRupee,
  Users,
  Settings,
  Shield,
  UserCog,
  BarChart3,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { RootState } from '@/store';
import { toggleSidebar } from '@/store/slices/uiSlice';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  to?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { key: 'kyc', label: 'KYC', icon: ShieldCheck, to: '/kyc' },
  { key: 'transactions', label: 'Transactions', icon: ReceiptIndianRupee, to: '/transactions' },
  { key: 'partners', label: 'Partners', icon: Users, to: '/partners/profile' },
  { key: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
  {
    key: 'admin',
    label: 'Admin',
    icon: Shield,
    children: [
      { key: 'users', label: 'Users', icon: UserCog, to: '/admin/users' },
      { key: 'reports', label: 'Reports', icon: BarChart3, to: '/admin/reports' },
    ],
  },
];

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['admin']);

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.key);
    const IconComponent = item.icon;

    if (hasChildren) {
      return (
        <div key={item.key}>
          <button
            onClick={() => !sidebarCollapsed && toggleExpanded(item.key)}
            className={`
              w-full flex items-center px-4 py-3 text-left transition-all duration-200
              hover:bg-primary-50 dark:hover:bg-gray-800 group
              ${depth > 0 ? 'pl-12' : ''}
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <IconComponent
              size={20}
              className="text-gray-600 dark:text-gray-400 group-hover:text-primary-600"
            />
            
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center justify-between flex-1 ml-3"
                >
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600">
                    {item.label}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {isExpanded && !sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {item.children?.map(child => renderMenuItem(child, depth + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (item.key === 'admin' && user?.role !== 'admin') {
      return null;
    }

    return (
      <NavLink
        key={item.key}
        to={item.to!}
        className={({ isActive }) => `
          flex items-center px-4 py-3 transition-all duration-200 group
          ${depth > 0 ? 'pl-12' : ''}
          ${sidebarCollapsed ? 'justify-center' : ''}
          ${
            isActive
              ? 'bg-gradient-primary text-white shadow-purple'
              : 'hover:bg-primary-50 dark:hover:bg-gray-800'
          }
        `}
      >
        {({ isActive }) => (
          <>
            <IconComponent
              size={20}
              className={`
                ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary-600'}
              `}
            />
            
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`ml-3 ${
                    isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-primary-600'
                  }`}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg z-30"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Partner Platform</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="py-4 space-y-1">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;