import { useState, useEffect, useCallback } from 'react';
import { invoicesDB } from '../db';
import { db } from '../../../utils/database';

export const useInvoices = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await db.get('currentUser');
      
      if (!currentUser || currentUser.role !== 'company') {
        setInvoices([]);
        return;
      }

      const companyInvoices = await invoicesDB.getInvoicesByCompany(currentUser.id);
      setInvoices(companyInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const deleteInvoice = useCallback(async (invoiceId) => {
    try {
      await invoicesDB.deleteInvoice(invoiceId);
      await loadInvoices();
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }, [loadInvoices]);

  const importInvoices = useCallback(async (invoicesData) => {
    try {
      const currentUser = await db.get('currentUser');
      if (!currentUser || currentUser.role !== 'company') {
        throw new Error('Only companies can import invoices');
      }

      const importedInvoices = await invoicesDB.importInvoices(invoicesData, currentUser.id);
      await loadInvoices();
      return importedInvoices;
    } catch (error) {
      console.error('Error importing invoices:', error);
      throw error;
    }
  }, [loadInvoices]);

  return {
    loading,
    invoices,
    loadInvoices,
    deleteInvoice,
    importInvoices,
  };
};

