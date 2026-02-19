import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Empty from '../../../components/Empty/Empty';
import { FaChartPie } from 'react-icons/fa';

const ExpensesChart = ({ data, options, title, t }) => {
  if (!data || !data.datasets || data.datasets.length === 0 || !data.datasets[0].data || data.datasets[0].data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
        <Empty
          icon={FaChartPie}
          title={t('dashboard.noData') || 'No Data Available'}
          description={t('dashboard.noDataDescription') || 'There is no expense data to display. Add financial data to see the chart.'}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default ExpensesChart;

