import { useState, useEffect } from 'react';
import { dashboardDB } from '../db';
import { assignedMissionsDB } from '../../Missions/db';
import { db } from '../../../utils/database';
import { 
  prepareChartData, 
  prepareBarChartData, 
  prepareDoughnutChartData,
  getChartOptions,
  getDoughnutChartOptions,
  formatCurrency
} from '../utils';
import { colors } from '../../../constants/colors';

export const useCompanyDashboardData = (months, t, locale) => {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [expensesData, setExpensesData] = useState(null);
  const [marginData, setMarginData] = useState(null);
  const [revenueBarData, setRevenueBarData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const financialData = await dashboardDB.getCompanyFinancialData();
        
        if (financialData) {
          setKpiData({
            ca: formatCurrency(financialData.currentRevenue || 0, locale),
            marge: formatCurrency(financialData.currentMargin || 0, locale),
            treso: formatCurrency(financialData.currentCash || 0, locale),
          });

          if (financialData.revenueHistory && financialData.revenueHistory.length > 0) {
            const revenueValues = financialData.revenueHistory.map(r => r.value);
            const revenueChartData = prepareChartData(
              revenueValues,
              months,
              t('dashboard.chartLabels.revenue'),
              colors.linkHover,
              `${colors.linkHover}20`
            );
            setRevenueData(revenueChartData);

            const revenueBarValues = financialData.revenueHistory.map((r, index) => ({
              monthIndex: index,
              value: r.value,
              trend: r.trend || (index > 0 && r.value > financialData.revenueHistory[index - 1].value ? 'up' : 'down')
            }));
            setRevenueBarData(revenueBarValues);
          }

          if (financialData.expenses && financialData.expenses.length > 0) {
            const expenseLabels = financialData.expenses.map(e => e.category);
            const expenseValues = financialData.expenses.map(e => e.amount);
            const expenseColors = [
              colors.linkHover,
              colors.buttonBackground,
              '#10b981',
              '#8b5cf6',
            ];
            const expensesChartData = prepareDoughnutChartData(
              expenseValues,
              expenseLabels,
              expenseColors
            );
            setExpensesData(expensesChartData);
          }

          if (financialData.marginHistory && financialData.marginHistory.length > 0) {
            const marginValues = financialData.marginHistory.map(m => m.value);
            const marginChartData = prepareBarChartData(
              marginValues,
              months,
              t('dashboard.chartLabels.margin'),
              colors.buttonBackground
            );
            setMarginData(marginChartData);
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [months, t, locale]);

  const revenueChartOptions = getChartOptions(locale, true);
  const marginChartOptions = getChartOptions(locale, true);
  const expensesChartOptions = getDoughnutChartOptions();

  return {
    loading,
    kpiData,
    revenueData,
    revenueChartOptions,
    revenueBarData,
    expensesData,
    expensesChartOptions,
    marginData,
    marginChartOptions,
  };
};

export const useExpertDashboardData = (months, t, locale) => {
  const [loading, setLoading] = useState(true);
  const [expertStats, setExpertStats] = useState(null);
  const [earningsData, setEarningsData] = useState(null);
  const [hoursData, setHoursData] = useState(null);
  const [recentMissions, setRecentMissions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const stats = await dashboardDB.getExpertStats();
        
        if (stats) {
          setExpertStats({
            activeMissions: stats.activeMissions || 0,
            completedMissions: stats.completedMissions || 0,
            rating: stats.rating || 0,
            availableMissions: stats.availableMissions || 0,
            totalEarnings: stats.totalEarnings || 0,
            totalHours: stats.totalHours || 0,
          });

          if (stats.earningsHistory && stats.earningsHistory.length > 0) {
            const earningsValues = stats.earningsHistory.map(e => e.value);
            const earningsChartData = prepareChartData(
              earningsValues,
              months,
              t('dashboard.expert.earnings'),
              '#10b981',
              '#10b98120'
            );
            setEarningsData(earningsChartData);
          }

          if (stats.hoursHistory && stats.hoursHistory.length > 0) {
            const hoursValues = stats.hoursHistory.map(h => h.value);
            const hoursChartData = prepareBarChartData(
              hoursValues,
              months,
              t('dashboard.expert.hours'),
              colors.linkHover
            );
            setHoursData(hoursChartData);
          }
        }

        const currentUser = await db.get('currentUser');
        if (currentUser && currentUser.role === 'expert') {
          const enrichedMissions = await assignedMissionsDB.getEnrichedMissionsForExpert(currentUser.id);
          const sortedMissions = enrichedMissions
            .filter(am => am.mission)
            .sort((a, b) => {
              const dateA = new Date(a.updatedAt || a.createdAt);
              const dateB = new Date(b.updatedAt || b.createdAt);
              return dateB - dateA;
            });
          setRecentMissions(sortedMissions);
        }
      } catch (error) {
        console.error('Error loading expert dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [months, t]);

  const earningsChartOptions = getChartOptions(locale, true);
  const hoursChartOptions = getChartOptions(locale, false, 'h');

  return {
    loading,
    expertStats,
    earningsData,
    earningsChartOptions,
    hoursData,
    hoursChartOptions,
    recentMissions,
  };
};

