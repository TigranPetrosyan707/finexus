import React from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import Button from '../UI/Button/Button';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger',
  icon: CustomIcon,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    if (CustomIcon) return <CustomIcon className="w-6 h-6" />;
    
    switch (variant) {
      case 'danger':
        return <FaExclamationTriangle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <FaCheckCircle className="w-6 h-6 text-green-500" />;
    }
  };

  const getIconBgColor = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'info':
        return 'bg-blue-100';
      default:
        return 'bg-green-100';
    }
  };

  const getConfirmButtonStyle = () => {
    switch (variant) {
      case 'danger':
        return { backgroundColor: '#ef4444', color: '#fff' };
      case 'warning':
        return { backgroundColor: '#f59e0b', color: '#fff' };
      case 'info':
        return { backgroundColor: colors.linkHover, color: '#fff' };
      default:
        return { backgroundColor: '#10b981', color: '#fff' };
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getIconBgColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            {title && (
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {title}
              </h2>
            )}
            {message && (
              <p className="text-gray-600">
                {message}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-3 mt-6">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
            disabled={isLoading}
          >
            {cancelText || 'Cancel'}
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            style={getConfirmButtonStyle()}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (confirmText || 'Confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

