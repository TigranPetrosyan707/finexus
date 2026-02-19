import React from 'react';
import { FaLock, FaExclamationCircle } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';

const PasswordForm = ({
  register,
  errors,
  handleSubmit,
  onSubmit,
  onCancel,
  showForm,
  onShowForm,
  isLoading,
  t,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.linkHover}15` }}>
            <FaLock className="w-6 h-6" style={{ color: colors.linkHover }} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('changePassword.title')}
          </h2>
        </div>
        {!showForm && (
          <Button
            onClick={onShowForm}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <FaLock className="w-4 h-4" />
            <span>{t('account.changePassword')}</span>
          </Button>
        )}
      </div>

      {showForm && (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('changePassword.oldPassword')}:
              </label>
              <Input
                {...register('oldPassword')}
                id="oldPassword"
                type="password"
                placeholder={t('changePassword.oldPasswordPlaceholder')}
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('changePassword.newPassword')}:
              </label>
              <Input
                {...register('newPassword')}
                id="newPassword"
                type="password"
                placeholder={t('changePassword.newPasswordPlaceholder')}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('changePassword.confirmPassword')}:
              </label>
              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                placeholder={t('changePassword.confirmPasswordPlaceholder')}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="flex items-center space-x-2 text-red-600">
                <FaExclamationCircle className="w-5 h-5" />
                <p className="text-sm">{errors.root.message}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} style={{ backgroundColor: colors.linkHover, color: '#fff' }}>
                {isLoading ? t('common.loading') || 'Loading...' : t('changePassword.update')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isLoading}
              >
                {t('account.cancel')}
              </Button>
            </div>
          </form>

          <div className="mt-8 p-6 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-3">
              {t('changePassword.requirements')}
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                {t('changePassword.minLength')}
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                {t('changePassword.uppercase')}
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                {t('changePassword.number')}
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                {t('changePassword.special')}
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default PasswordForm;

