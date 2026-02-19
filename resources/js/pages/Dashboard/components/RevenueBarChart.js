import React from 'react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import Empty from '../../../components/Empty/Empty';
import { FaChartBar } from 'react-icons/fa';

const RevenueBarChart = ({ data, months, title, t, i18n }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
        <Empty
          icon={FaChartBar}
          title={t('dashboard.noData') || 'No Data Available'}
          description={t('dashboard.noDataDescription') || 'There is no revenue data to display.'}
        />
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <FaArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <FaArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <FaMinus className="w-4 h-4 text-gray-500" />;
    }
  };

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
      <div>
        <div className="flex items-end justify-between space-x-2 h-40 mb-4">
          {data.map((item, index) => {
            const height = ((item.value - minValue) / range) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 relative group"
                    style={{
                      height: `${Math.max(height, 10)}%`,
                      backgroundColor: '#3b82f6',
                      minHeight: '20px',
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : 'fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      }).format(item.value)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-col items-center">
                  <span className="text-xs text-gray-600 font-medium">
                    {months[item.monthIndex] || `Month ${item.monthIndex + 1}`}
                  </span>
                  <div className="mt-1">{getTrendIcon(item.trend)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueBarChart;

