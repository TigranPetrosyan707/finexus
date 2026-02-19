import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaChartLine, FaCheckCircle, FaBriefcase, FaStar, FaUser } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { colors } from '../../constants/colors';
import { useCompanyDashboardData, useExpertDashboardData } from './hooks/useDashboardData';
import KPICard from './components/KPICard';
import RevenueChart from './components/RevenueChart';
import RevenueBarChart from './components/RevenueBarChart';
import ExpensesChart from './components/ExpensesChart';
import MarginChart from './components/MarginChart';
import ExpertEarningsChart from './components/ExpertEarningsChart';
import ExpertHoursChart from './components/ExpertHoursChart';
import RecentMissions from './components/RecentMissions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { userRole } = useAuth();

  const months = useMemo(() => [
    t('dashboard.months.january'),
    t('dashboard.months.february'),
    t('dashboard.months.march'),
    t('dashboard.months.april'),
    t('dashboard.months.may'),
    t('dashboard.months.june'),
  ], [t]);

  const locale = i18n.language;

  const {
    kpiData,
    revenueData,
    revenueChartOptions,
    revenueBarData,
    expensesData,
    expensesChartOptions,
    marginData,
    marginChartOptions,
  } = useCompanyDashboardData(months, t, locale);

  const {
    expertStats,
    earningsData,
    earningsChartOptions,
    hoursData,
    hoursChartOptions,
    recentMissions,
  } = useExpertDashboardData(months, t, locale);

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: colors.sectionGray }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.linkHover, transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.buttonBackground, transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {t('dashboard.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <FaChartLine className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('dashboard.subtitle')}
            </p>
          </div>
        </div>

        {userRole === 'company' ? (
          <>
            {kpiData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KPICard
                  title={t('dashboard.ca')}
                  value={kpiData.ca}
                />
                <KPICard
                  title={t('dashboard.marge')}
                  value={kpiData.marge}
                />
                <KPICard
                  title={t('dashboard.tresorerie')}
                  value={kpiData.treso}
                />
              </div>
            )}

            {revenueBarData && revenueBarData.length > 0 ? (
              <div className="mb-8">
                <RevenueBarChart
                  data={revenueBarData}
                  months={months}
                  title={t('dashboard.evolution')}
                  t={t}
                  i18n={i18n}
                />
              </div>
            ) : (
              <div className="mb-8">
                <RevenueChart
                  data={revenueData}
                  options={revenueChartOptions}
                  title={t('dashboard.evolution')}
                  t={t}
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <ExpensesChart
                data={expensesData}
                options={expensesChartOptions}
                title={t('dashboard.charges')}
                t={t}
              />

              <MarginChart
                data={marginData}
                options={marginChartOptions}
                title={t('dashboard.margeOp')}
                t={t}
              />
            </div>
          </>
        ) : (
          <>
            {expertStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                  title={t('dashboard.expert.activeMissions')}
                  value={expertStats.activeMissions}
                  icon={FaBriefcase}
                  iconColor={colors.linkHover}
                />
                <KPICard
                  title={t('dashboard.expert.completedMissions')}
                  value={expertStats.completedMissions}
                  icon={FaCheckCircle}
                  iconColor="#10b981"
                />
                <KPICard
                  title={t('dashboard.expert.rating')}
                  value={`${expertStats.rating}/5`}
                  icon={FaStar}
                  iconColor="#fbbf24"
                />
                <KPICard
                  title={t('dashboard.expert.availableMissions')}
                  value={expertStats.availableMissions}
                  icon={FaBriefcase}
                  iconColor={colors.buttonBackground}
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <ExpertEarningsChart
                data={earningsData}
                options={earningsChartOptions}
                title={t('dashboard.expert.earningsEvolution')}
                total={expertStats?.totalEarnings}
                t={t}
                locale={locale}
              />

              <ExpertHoursChart
                data={hoursData}
                options={hoursChartOptions}
                title={t('dashboard.expert.hoursWorked')}
                total={expertStats?.totalHours}
                t={t}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <RecentMissions missions={recentMissions} t={t} />

              <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {t('dashboard.expert.quickActions')}
                </h2>
                <div className="space-y-3">
                  <Link to="/available-missions" className="block p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div className="flex items-center space-x-3">
                      <FaBriefcase className="w-5 h-5" style={{ color: colors.linkHover }} />
                      <span className="font-semibold text-gray-900">{t('dashboard.expert.browseMissions')}</span>
                    </div>
                  </Link>
                  <Link to="/expert-profile" className="block p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div className="flex items-center space-x-3">
                      <FaUser className="w-5 h-5" style={{ color: colors.linkHover }} />
                      <span className="font-semibold text-gray-900">{t('dashboard.expert.editProfile')}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
