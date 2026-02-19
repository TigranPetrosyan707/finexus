export const INVOICE_SCHEMA = {
  id: '',
  companyId: '',
  invoiceNumber: '',
  date: '',
  dueDate: '',
  amount: 0,
  tax: 0,
  total: 0,
  status: 'pending',
  supplier: '',
  description: '',
  category: '',
  createdAt: '',
  updatedAt: '',
};

export const formatInvoice = (invoice) => {
  if (!invoice) {
    return {
      id: '',
      companyId: '',
      invoiceNumber: '',
      date: '',
      dueDate: '',
      amount: 0,
      tax: 0,
      total: 0,
      status: 'pending',
      supplier: '',
      description: '',
      category: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: invoice.id || '',
    companyId: invoice.companyId || '',
    invoiceNumber: invoice.invoiceNumber || '',
    date: invoice.date || '',
    dueDate: invoice.dueDate || '',
    amount: invoice.amount || 0,
    tax: invoice.tax || 0,
    total: invoice.total || 0,
    status: invoice.status || 'pending',
    supplier: invoice.supplier || '',
    description: invoice.description || '',
    category: invoice.category || '',
    createdAt: invoice.createdAt || new Date().toISOString(),
    updatedAt: invoice.updatedAt || new Date().toISOString(),
  };
};

