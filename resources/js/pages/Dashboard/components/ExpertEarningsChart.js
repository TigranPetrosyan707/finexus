import React from 'react';
import { Line } from 'react-chartjs-2';
import { FaEuroSign } from 'react-icons/fa';
import Empty from '../../../components/Empty/Empty';
import { FaChartLine } from 'react-icons/fa';
import { formatCurrencyShort } from '../utils';

const ExpertEarningsChart = ({ data, options, title, total, t, locale }) => {
  if (!data || !data.datasets || data.datasets.length === 0 || !data.datasets[0].data || data.datasets[0].data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
        <Empty
          icon={FaChartLine}
          title={t('dashboard.noData') || 'No Data Available'}
          description={t('dashboard.noDataDescription') || 'There is no earnings data to display.'}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        {total !== undefined && total !== null && (
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
            <span>
              {t('dashboard.expert.total')}: {formatCurrencyShort(total, locale)}
            </span>
            <FaEuroSign className="w-5 h-5" style={{ color: '#10b981' }} />
          </div>
        )}
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ExpertEarningsChart;

