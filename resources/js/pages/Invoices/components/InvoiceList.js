import React from 'react';
import InvoiceCard from './InvoiceCard';
import Empty from '../../../components/Empty/Empty';
import { FaFileInvoice } from 'react-icons/fa';

const InvoiceList = ({ invoices, onDelete, t }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <Empty
        icon={FaFileInvoice}
        title={t('invoices.noInvoices')}
        description={t('invoices.noInvoicesDescription')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} onDelete={onDelete} t={t} />
      ))}
    </div>
  );
};

export default InvoiceList;

