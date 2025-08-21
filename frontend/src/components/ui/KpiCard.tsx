import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    period?: string;
  };
  gradient?: 'primary' | 'teal' | 'sky' | 'rose';
  className?: string;
}

const gradientClasses = {
  primary: 'bg-gradient-primary',
  teal: 'bg-gradient-teal',
  sky: 'bg-gradient-sky',
  rose: 'bg-gradient-rose',
};

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  gradient = 'primary',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-card
        hover:shadow-card-hover transition-all duration-300 group
        ${className}
      `}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 ${gradientClasses[gradient]} opacity-5 group-hover:opacity-10 transition-opacity`} />
      
      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {title}
            </p>
            
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </h3>
              
              {trend && (
                <div className={`flex items-center space-x-1 text-sm ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span>{Math.abs(trend.value)}%</span>
                  {trend.period && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {trend.period}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Icon */}
          <div className={`
            p-3 rounded-lg ${gradientClasses[gradient]} 
            shadow-lg group-hover:scale-110 transition-transform
          `}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KpiCard;