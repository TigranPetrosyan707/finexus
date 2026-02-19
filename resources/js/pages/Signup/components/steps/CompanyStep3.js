import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Input from '../../../../components/UI/Input/Input';

const CompanyStep3 = ({ register, errors, t, watch }) => {
  const password = watch('password') || '';

  const checkMinLength = password.length >= 8;
  const checkUppercase = /[A-Z]/.test(password);
  const checkLowercase = /[a-z]/.test(password);
  const checkSymbol = /[^a-zA-Z0-9]/.test(password);
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('signup.step3')}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.password')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('password')}
            id="password"
            name="password"
            type="password"
            placeholder={t('signup.password')}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.confirmPassword')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('confirmPassword')}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder={t('signup.confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
          <div className="mt-2 text-sm space-y-1">
            <p className={`flex items-center justify-between gap-2 ${checkMinLength ? 'text-green-600' : 'text-gray-600'}`}>
              <span>* {t('signup.passwordRequirements.minLength')}</span>
              {checkMinLength && <FaCheckCircle className="w-4 h-4" />}
            </p>
            <p className={`flex items-center justify-between gap-2 ${checkUppercase ? 'text-green-600' : 'text-gray-600'}`}>
              <span>* {t('signup.passwordRequirements.uppercase')}</span>
              {checkUppercase && <FaCheckCircle className="w-4 h-4" />}
            </p>
            <p className={`flex items-center justify-between gap-2 ${checkLowercase ? 'text-green-600' : 'text-gray-600'}`}>
              <span>* {t('signup.passwordRequirements.lowercase')}</span>
              {checkLowercase && <FaCheckCircle className="w-4 h-4" />}
            </p>
            <p className={`flex items-center justify-between gap-2 ${checkSymbol ? 'text-green-600' : 'text-gray-600'}`}>
              <span>* {t('signup.passwordRequirements.symbol')}</span>
              {checkSymbol && <FaCheckCircle className="w-4 h-4" />}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStep3;

