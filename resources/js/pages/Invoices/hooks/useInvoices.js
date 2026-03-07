import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../utils/api';

export const useInvoices = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/invoices');
      setInvoices(data.invoices ?? []);
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
    await api.delete(`/api/invoices/${invoiceId}`);
    await loadInvoices();
    return true;
  }, [loadInvoices]);

  const importInvoices = useCallback(async (invoicesData) => {
    const data = await api.post('/api/invoices/import', { invoices: invoicesData });
    await loadInvoices();
    return data.invoices ?? [];
  }, [loadInvoices]);

  return {
    loading,
    invoices,
    loadInvoices,
    deleteInvoice,
    importInvoices,
  };
};

