export const COMPANY_FINANCIAL_DATA_SCHEMA = {
  currentRevenue: 0,
  currentMargin: 0,
  currentCash: 0,
  revenueHistory: [
    { value: 0, trend: 'up' },
  ],
  marginHistory: [
    { value: 0 },
  ],
  expenses: [
    { category: 'Salaries', amount: 0 },
    { category: 'Rent', amount: 0 },
    { category: 'Suppliers', amount: 0 },
    { category: 'Others', amount: 0 },
  ],
};

export const EXPERT_STATS_SCHEMA = {
  activeMissions: 0,
  completedMissions: 0,
  rating: 0,
  availableMissions: 0,
  totalEarnings: 0,
  totalHours: 0,
  earningsHistory: [
    { value: 0 },
  ],
  hoursHistory: [
    { value: 0 },
  ],
};

