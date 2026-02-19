import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';

const ProfileForm = ({
  register,
  errors,
  handleSubmit,
  onSubmit,
  onCancel,
  isLoading,
  t,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('expertProfile.editProfile') || 'Edit Profile'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          type="button"
        >
          <FaTimes className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('expertProfile.firstname') || 'First Name'} *
          </label>
          <Input
            {...register('firstname')}
            type="text"
            placeholder={t('expertProfile.firstname') || 'First Name'}
          />
          {errors.firstname && (
            <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('expertProfile.lastname') || 'Last Name'} *
          </label>
          <Input
            {...register('lastname')}
            type="text"
            placeholder={t('expertProfile.lastname') || 'Last Name'}
          />
          {errors.lastname && (
            <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('expertProfile.email')} *
          </label>
          <Input
            {...register('email')}
            type="email"
            placeholder={t('expertProfile.email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('expertProfile.phone')} *
          </label>
          <Input
            {...register('phone')}
            type="tel"
            placeholder={t('expertProfile.phone')}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('expertProfile.linkedin')}
          </label>
          <Input
            {...register('linkedin')}
            type="url"
            placeholder="linkedin.com/in/yourprofile"
          />
          {errors.linkedin && (
            <p className="text-red-500 text-sm mt-1">{errors.linkedin.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('signup.expert.profession')} *
          </label>
          <Input
            {...register('profession')}
            type="text"
            placeholder={t('signup.expert.profession')}
          />
          {errors.profession && (
            <p className="text-red-500 text-sm mt-1">{errors.profession.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('signup.expert.experience')} *
          </label>
          <Input
            {...register('experience')}
            type="number"
            min="0"
            placeholder={t('signup.expert.experience')}
          />
          {errors.experience && (
            <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('expertProfile.dailyRate')} *
          </label>
          <div className="flex items-center space-x-2">
            <Input
              {...register('dailyRate')}
              type="number"
              min="0"
              step="0.01"
              placeholder={t('expertProfile.dailyRate')}
            />
            <span className="text-gray-600">€/{t('expertProfile.perDay')}</span>
          </div>
          {errors.dailyRate && (
            <p className="text-red-500 text-sm mt-1">{errors.dailyRate.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('expertProfile.description')}
        </label>
        <textarea
          {...register('description')}
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('expertProfile.description')}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          className="flex-1"
          style={{ backgroundColor: colors.linkHover, color: '#fff' }}
          disabled={isLoading}
        >
          {isLoading ? (t('common.loading') || 'Loading...') : (t('expertProfile.save') || 'Save')}
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
  );
};

export default ProfileForm;

