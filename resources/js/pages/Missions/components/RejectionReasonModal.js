import React from 'react';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';
import Button from '../../../components/UI/Button/Button';

const RejectionReasonModal = ({ isOpen, onClose, rejectionReason, rejectedBy, requestType, t }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getDescriptionKey = () => {
    if (requestType === 'application') {
      return rejectedBy === 'company' 
        ? 'missions.rejectionReasonModal.descriptionCompanyRejectedApplication'
        : 'missions.rejectionReasonModal.descriptionExpertRejectedApplication';
    } else {
      return rejectedBy === 'expert'
        ? 'missions.rejectionReasonModal.descriptionExpertRejectedRequest'
        : 'missions.rejectionReasonModal.descriptionCompanyRejectedRequest';
    }
  };

  const defaultDescription = rejectedBy === 'company'
    ? 'The company provided the following reason for rejecting this request:'
    : 'The expert provided the following reason for rejecting this request:';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100">
            <FaInfoCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {t('missions.rejectionReasonModal.title') || 'Rejection Reason'}
            </h2>
            <p className="text-gray-600 mb-4">
              {t(getDescriptionKey()) || defaultDescription}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[100px]">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {rejectionReason || t('missions.rejectionReasonModal.noReason') || 'No reason provided.'}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            {t('missions.rejectionReasonModal.close') || 'Close'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RejectionReasonModal;

