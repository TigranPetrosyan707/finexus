import { db } from '../../../utils/database';

export const dashboardDB = {
  async getCompanyFinancialData() {
    const data = await db.get('companyFinancialData');
    return data || null;
  },

  async saveCompanyFinancialData(data) {
    return await db.set('companyFinancialData', data);
  },

  async getExpertStats() {
    const data = await db.get('expertStats');
    return data || null;
  },

  async saveExpertStats(stats) {
    return await db.set('expertStats', stats);
  },
};

