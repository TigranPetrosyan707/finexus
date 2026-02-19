import React from 'react';
import { useTranslation } from 'react-i18next';

const Empty = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-white rounded-2xl p-8 md:p-16 shadow-sm border border-gray-100 text-center ${className}`}>
      {Icon && (
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
        </div>
      )}
      {title && (
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
          {typeof title === 'string' && title.startsWith('common.') ? t(title) : title}
        </h3>
      )}
      {description && (
        <p className="text-sm md:text-base text-gray-600 mb-6 max-w-md mx-auto">
          {typeof description === 'string' && description.startsWith('common.') ? t(description) : description}
        </p>
      )}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default Empty;

