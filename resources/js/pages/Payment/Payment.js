import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCreditCard, FaCheckCircle, FaExclamationCircle, FaLock } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';

const Payment = ({ plan: planProp }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    cardExp: '',
    cardCVC: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const plan = planProp || location.state?.plan || { name: 'Pro', price: '79€/mois' };
    setSelectedPlan(plan);
  }, [location, planProp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    } else if (name === 'cardExp') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    } else if (name === 'cardCVC') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
    setError('');
    setSuccess('');
  };

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
  };

  const validateExpiry = (exp) => {
    const [month, year] = exp.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) return false;
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt('20' + year, 10);
    const currentDate = new Date();
    const expiryDate = new Date(yearNum, monthNum - 1);
    return monthNum >= 1 && monthNum <= 12 && expiryDate > currentDate;
  };

  const validateCVC = (cvc) => {
    return cvc.length === 3 && /^\d+$/.test(cvc);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.cardName.trim()) {
      setError(t('payment.cardNameRequired'));
      return;
    }

    if (!validateCardNumber(formData.cardNumber)) {
      setError(t('payment.cardNumberInvalid'));
      return;
    }

    if (!validateExpiry(formData.cardExp)) {
      setError(t('payment.expiryInvalid'));
      return;
    }

    if (!validateCVC(formData.cardCVC)) {
      setError(t('payment.cvcInvalid'));
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(t('payment.success'));
      if (!isEmbedded) {
        setTimeout(() => {
          navigate('/account');
        }, 2000);
      }
    }, 2000);
  };

  const isEmbedded = !!planProp;

  if (isEmbedded) {
    return (
      <>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
              <FaExclamationCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
              <FaCheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex items-center justify-center space-x-2 mb-4 text-sm text-gray-600">
            <FaLock className="w-4 h-4" />
            <span>{t('payment.securePayment')}</span>
          </div>

          <div>
            <label htmlFor={`cardName-${planProp?.name || 'embedded'}`} className="block text-sm font-medium text-gray-700 mb-2">
              {t('payment.cardNameRequired')} <span className="text-red-500">*</span>
            </label>
            <Input
              id={`cardName-${planProp?.name || 'embedded'}`}
              name="cardName"
              type="text"
              required
              placeholder="Jean Dupont"
              value={formData.cardName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor={`cardNumber-${planProp?.name || 'embedded'}`} className="block text-sm font-medium text-gray-700 mb-2">
              {t('payment.cardNumberRequired')} <span className="text-red-500">*</span>
            </label>
            <Input
              id={`cardNumber-${planProp?.name || 'embedded'}`}
              name="cardNumber"
              type="text"
              required
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength="19"
              value={formData.cardNumber}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`cardExp-${planProp?.name || 'embedded'}`} className="block text-sm font-medium text-gray-700 mb-2">
                {t('payment.expiryRequired')} <span className="text-red-500">*</span>
              </label>
              <Input
                id={`cardExp-${planProp?.name || 'embedded'}`}
                name="cardExp"
                type="text"
                required
                placeholder="MM/AA"
                maxLength="5"
                value={formData.cardExp}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor={`cardCVC-${planProp?.name || 'embedded'}`} className="block text-sm font-medium text-gray-700 mb-2">
                {t('payment.cvcRequired')} <span className="text-red-500">*</span>
              </label>
              <Input
                id={`cardCVC-${planProp?.name || 'embedded'}`}
                name="cardCVC"
                type="text"
                required
                placeholder="123"
                maxLength="3"
                value={formData.cardCVC}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? t('payment.processing') : t('payment.pay')}
          </Button>
        </form>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mt-6">
            <div className="flex items-start space-x-3">
              <FaLock className="w-5 h-5 text-gray-500 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-semibold mb-1">{t('payment.securityTitle')}</p>
                <p>{t('payment.securityText')}</p>
              </div>
            </div>
          </div>
        </>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: colors.sectionGray }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.linkHover, transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.buttonBackground, transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: `${colors.linkHover}20` }}>
            <FaCreditCard className="w-10 h-10" style={{ color: colors.linkHover }} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('payment.title')}
          </h1>
        </div>

        <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: colors.buttonBackground, color: colors.buttonText }}>
          <p className="text-sm font-medium text-center">
            {t('payment.demo')}
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 lg:p-10 shadow-lg border border-gray-200 mb-6">
          {selectedPlan && (
            <div className="text-center mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {t('payment.selectedPlan')}: {selectedPlan.name}
              </h2>
              <p className="text-xl font-bold" style={{ color: colors.linkHover }}>
                {selectedPlan.price}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                <FaExclamationCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                <FaCheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
            )}

            <div className="flex items-center justify-center space-x-2 mb-4 text-sm text-gray-600">
              <FaLock className="w-4 h-4" />
              <span>{t('payment.securePayment')}</span>
            </div>

            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('payment.cardNameRequired')} <span className="text-red-500">*</span>
              </label>
              <Input
                id="cardName"
                name="cardName"
                type="text"
                required
                placeholder="Jean Dupont"
                value={formData.cardName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                {t('payment.cardNumberRequired')} <span className="text-red-500">*</span>
              </label>
              <Input
                id="cardNumber"
                name="cardNumber"
                type="text"
                required
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength="19"
                value={formData.cardNumber}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardExp" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('payment.expiryRequired')} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="cardExp"
                  name="cardExp"
                  type="text"
                  required
                  placeholder="MM/AA"
                  maxLength="5"
                  value={formData.cardExp}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('payment.cvcRequired')} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="cardCVC"
                  name="cardCVC"
                  type="text"
                  required
                  placeholder="123"
                  maxLength="3"
                  value={formData.cardCVC}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? t('payment.processing') : t('payment.pay')}
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-start space-x-3">
            <FaLock className="w-5 h-5 text-gray-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">{t('payment.securityTitle')}</p>
              <p>{t('payment.securityText')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

