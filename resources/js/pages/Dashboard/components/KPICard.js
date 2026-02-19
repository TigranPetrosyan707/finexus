import React from 'react';

const KPICard = ({ title, value, icon: Icon, iconColor, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-200 ${className}`}>
      {Icon && (
        <div className="flex items-center space-x-3 mb-2">
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
      )}
      {!Icon && (
        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      )}
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default KPICard;

