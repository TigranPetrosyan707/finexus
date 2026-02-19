import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';

const UserInfoForm = ({
  register,
  errors,
  handleSubmit,
  onSubmit,
  onCancel,
  userRole,
  isLoading,
  t,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {userRole === 'expert' 
            ? (t('account.editExpertInfo') || 'Edit Expert Information')
            : (t('account.editUserInfo') || 'Edit User Information')
          }
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <FaTimes className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('account.firstname')} *
          </label>
          <Input
            {...register('firstname')}
            type="text"
            placeholder={t('account.firstname')}
          />
          {errors.firstname && (
            <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('account.lastname')} *
          </label>
          <Input
            {...register('lastname')}
            type="text"
            placeholder={t('account.lastname')}
          />
          {errors.lastname && (
            <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('account.email')} *
          </label>
          <Input
            {...register('email')}
            type="email"
            placeholder={t('account.email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('account.phone')} *
          </label>
          <Input
            {...register('phone')}
            type="tel"
            placeholder={t('account.phone')}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {userRole === 'company' && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('account.role')}
            </label>
            <Input
              {...register('role')}
              type="text"
              placeholder={t('account.role')}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1"
            style={{ backgroundColor: colors.linkHover, color: '#fff' }}
            disabled={isLoading}
          >
            {isLoading ? (t('common.loading') || 'Loading...') : (t('account.save') || 'Save')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
            disabled={isLoading}
          >
            {t('account.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserInfoForm;

