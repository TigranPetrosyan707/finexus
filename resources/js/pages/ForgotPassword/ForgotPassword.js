import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError(t('forgotPassword.emailRequired'));
      return;
    }

    setSuccess(t('forgotPassword.success'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f5f6fa' }}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl p-8 lg:p-10 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${colors.linkHover}20` }}>
              <FaEnvelope className="w-8 h-8" style={{ color: colors.linkHover }} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('forgotPassword.title')}
            </h2>
            <p className="text-base text-gray-600">
              {t('forgotPassword.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <Input
              id="forgotEmail"
              name="email"
              type="email"
              placeholder={t('forgotPassword.email')}
              required
              value={email}
              onChange={handleChange}
            />

            <Button type="submit" className="w-full">
              {t('forgotPassword.submit')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

