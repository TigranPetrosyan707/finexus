import { db } from '../../../utils/database';
import { formatInvoice } from './schema';

const INVOICES_STORAGE_KEY = 'invoices';

export const invoicesDB = {
  async getAllInvoices() {
    try {
      const invoices = await db.get(INVOICES_STORAGE_KEY);
      return invoices || [];
    } catch (error) {
      console.error('Error getting invoices:', error);
      return [];
    }
  },

  async getInvoicesByCompany(companyId) {
    try {
      const invoices = await this.getAllInvoices();
      return invoices.filter(invoice => invoice.companyId === companyId);
    } catch (error) {
      console.error('Error getting invoices by company:', error);
      return [];
    }
  },

  async getInvoiceById(invoiceId) {
    try {
      const invoices = await this.getAllInvoices();
      return invoices.find(invoice => invoice.id === invoiceId) || null;
    } catch (error) {
      console.error('Error getting invoice by id:', error);
      return null;
    }
  },

  async createInvoice(invoiceData) {
    try {
      const invoices = await this.getAllInvoices();
      const newInvoice = formatInvoice({
        ...invoiceData,
        id: `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      invoices.push(newInvoice);
      await db.set(INVOICES_STORAGE_KEY, invoices);
      return newInvoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  async updateInvoice(invoiceId, updates) {
    try {
      const invoices = await this.getAllInvoices();
      const index = invoices.findIndex(inv => inv.id === invoiceId);
      
      if (index === -1) {
        throw new Error('Invoice not found');
      }

      invoices[index] = {
        ...invoices[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      await db.set(INVOICES_STORAGE_KEY, invoices);
      return invoices[index];
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  async deleteInvoice(invoiceId) {
    try {
      const invoices = await this.getAllInvoices();
      const filteredInvoices = invoices.filter(inv => inv.id !== invoiceId);
      await db.set(INVOICES_STORAGE_KEY, filteredInvoices);
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },

  async importInvoices(invoicesData, companyId) {
    try {
      const invoices = await this.getAllInvoices();
      const importedInvoices = invoicesData.map((invoiceData, index) => {
        return formatInvoice({
          ...invoiceData,
          id: `invoice_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
          companyId: companyId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });

      invoices.push(...importedInvoices);
      await db.set(INVOICES_STORAGE_KEY, invoices);
      return importedInvoices;
    } catch (error) {
      console.error('Error importing invoices:', error);
      throw error;
    }
  },
};

