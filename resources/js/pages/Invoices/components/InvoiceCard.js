import React from 'react';
import { FaFileInvoice, FaCalendar, FaEuroSign, FaTag } from 'react-icons/fa';
import { colors } from '../../../constants/colors';

const InvoiceCard = ({ invoice, onDelete, t }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.linkHover}15` }}>
            <FaFileInvoice className="w-6 h-6" style={{ color: colors.linkHover }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber || t('invoices.noNumber')}</h3>
            {invoice.supplier && (
              <p className="text-sm text-gray-600">{invoice.supplier}</p>
            )}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
          {t(`invoices.status.${invoice.status}`) || invoice.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {invoice.date && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaCalendar className="w-4 h-4" />
            <span>{t('invoices.date')}: {formatDate(invoice.date)}</span>
          </div>
        )}
        {invoice.dueDate && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaCalendar className="w-4 h-4" />
            <span>{t('invoices.dueDate')}: {formatDate(invoice.dueDate)}</span>
          </div>
        )}
        {invoice.category && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaTag className="w-4 h-4" />
            <span>{invoice.category}</span>
          </div>
        )}
        {invoice.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{invoice.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <FaEuroSign className="w-4 h-4 text-gray-600" />
          <span className="text-xl font-bold text-gray-900">{invoice.total?.toFixed(2) || '0.00'}</span>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(invoice.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
          >
            {t('invoices.delete')}
          </button>
        )}
      </div>
    </div>
  );
};

export default InvoiceCard;

