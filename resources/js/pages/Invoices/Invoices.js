import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { router } from '@inertiajs/react';
import { FaUpload, FaFileCsv, FaFileInvoice } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import Button from '../../components/UI/Button/Button';
import { useInvoices } from './hooks/useInvoices';
import InvoiceList from './components/InvoiceList';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import toast from 'react-hot-toast';

const Invoices = () => {
  const { t } = useTranslation();
  const { userRole } = useAuth();
  const { invoices, deleteInvoice, importInvoices } = useInvoices();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, invoiceId: null });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userRole !== 'company') {
      router.visit('/search-experts', { replace: true });
    }
  }, [userRole]);

  if (userRole !== 'company') {
    return null;
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      toast.error(t('invoices.unsupportedFormat'));
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error(t('invoices.emptyFile'));
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const importedData = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === 0 || !values[0]) continue;

        const invoiceData = {};
        headers.forEach((header, index) => {
          const value = values[index] || '';
          switch (header) {
            case 'invoice number':
            case 'number':
            case 'invoice_number':
              invoiceData.invoiceNumber = value;
              break;
            case 'date':
              invoiceData.date = value;
              break;
            case 'due date':
            case 'due_date':
            case 'due':
              invoiceData.dueDate = value;
              break;
            case 'amount':
              invoiceData.amount = parseFloat(value) || 0;
              break;
            case 'tax':
            case 'vat':
              invoiceData.tax = parseFloat(value) || 0;
              break;
            case 'total':
              invoiceData.total = parseFloat(value) || 0;
              break;
            case 'status':
              invoiceData.status = value.toLowerCase();
              break;
            case 'supplier':
            case 'vendor':
              invoiceData.supplier = value;
              break;
            case 'description':
              invoiceData.description = value;
              break;
            case 'category':
              invoiceData.category = value;
              break;
            default:
              break;
          }
        });

        if (invoiceData.invoiceNumber || invoiceData.date) {
          if (!invoiceData.total && invoiceData.amount) {
            invoiceData.total = invoiceData.amount + (invoiceData.tax || 0);
          }
          importedData.push(invoiceData);
        }
      }

      if (importedData.length === 0) {
        toast.error(t('invoices.noValidData'));
        return;
      }

      await importInvoices(importedData);
      toast.success(t('invoices.importSuccess', { count: importedData.length }));
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing invoices:', error);
      toast.error(t('invoices.importError'));
    }
  };

  const handleDeleteClick = (invoiceId) => {
    setDeleteModal({ isOpen: true, invoiceId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteInvoice(deleteModal.invoiceId);
      toast.success(t('invoices.deleteSuccess'));
      setDeleteModal({ isOpen: false, invoiceId: null });
    } catch (error) {
      toast.error(t('invoices.deleteError'));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, invoiceId: null });
  };

  return (
    <div className="relative overflow-hidden min-h-screen" style={{ backgroundColor: colors.sectionGray }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.linkHover, transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.buttonBackground, transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {t('invoices.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <FaFileInvoice className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('invoices.subtitle')}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.linkHover}15` }}>
                <FaFileCsv className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t('invoices.supportedFormats')}</h2>
                <p className="text-sm text-gray-600">CSV, Excel (.xlsx, .xls)</p>
              </div>
            </div>
            <label className="cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                className="flex items-center space-x-2"
                style={{ backgroundColor: colors.linkHover, color: '#fff' }}
              >
                <FaUpload className="w-5 h-5" />
                <span>{t('invoices.import')}</span>
              </Button>
            </label>
          </div>
        </div>

        <InvoiceList invoices={invoices} onDelete={handleDeleteClick} t={t} />

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title={t('invoices.confirmDelete')}
          message={t('invoices.confirmDeleteMessage')}
          confirmText={t('invoices.delete')}
          cancelText={t('common.cancel')}
        />
      </div>
    </div>
  );
};

export default Invoices;

