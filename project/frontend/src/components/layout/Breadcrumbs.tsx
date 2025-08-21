import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  kyc: 'KYC Verification',
  transactions: 'Transactions',
  partners: 'Partners',
  profile: 'Profile',
  settings: 'Settings',
  admin: 'Admin',
  users: 'Users',
  reports: 'Reports',
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', to: '/' },
  ];

  let currentPath = '';
  pathnames.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    if (index === pathnames.length - 1) {
      // Last item - current page (no link)
      breadcrumbs.push({ label });
    } else {
      breadcrumbs.push({ label, to: currentPath });
    }
  });

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight size={16} className="text-gray-400 mx-2" />
            )}
            
            {index === 0 && (
              <Home size={16} className="text-gray-400 mr-2" />
            )}
            
            {item.to ? (
              <Link
                to={item.to}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-gray-900 dark:text-white font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;