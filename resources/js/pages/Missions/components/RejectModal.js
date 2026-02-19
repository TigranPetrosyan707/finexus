import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../../../components/UI/Button/Button';

const RejectModal = ({ isOpen, onClose, onConfirm, t, isLoading = false }) => {
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setRejectionReason('');
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(rejectionReason);
    setRejectionReason('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100">
            <FaExclamationTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {t('missions.rejectModal.title') || 'Reject Request'}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('missions.rejectModal.message') || 'Are you sure you want to reject this request? You can optionally provide a reason.'}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            disabled={isLoading}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('missions.rejectModal.reasonLabel') || 'Reason (Optional)'}
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder={t('missions.rejectModal.reasonPlaceholder') || 'Enter your reason for rejecting this request...'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-300 focus:border-red-400 focus:outline-none resize-none"
            rows="4"
            disabled={isLoading}
          />
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleCancel}
            variant="secondary"
            className="flex-1"
            disabled={isLoading}
          >
            {t('missions.rejectModal.cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            style={{ backgroundColor: '#ef4444', color: '#fff' }}
            disabled={isLoading}
          >
            {isLoading 
              ? (t('missions.rejectModal.processing') || 'Processing...') 
              : (t('missions.rejectModal.confirm') || 'Reject')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;

