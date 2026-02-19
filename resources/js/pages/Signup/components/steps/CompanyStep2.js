import React from 'react';
import { Controller } from 'react-hook-form';
import Input from '../../../../components/UI/Input/Input';
import Select from '../../../../components/UI/Select/Select';

const CompanyStep2 = ({ register, control, errors, watchedRole, translatedRoleOptions, t }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('signup.step2')}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.firstname')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('firstname')}
            id="firstname"
            name="firstname"
            type="text"
            placeholder={t('signup.firstname')}
          />
          {errors.firstname && (
            <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.lastname')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('lastname')}
            id="lastname"
            name="lastname"
            type="text"
            placeholder={t('signup.lastname')}
          />
          {errors.lastname && (
            <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.email')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('email')}
            id="email"
            name="email"
            type="email"
            placeholder={t('signup.email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.phone')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('phone')}
            id="phone"
            name="phone"
            type="tel"
            placeholder={t('signup.phone')}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.role')} <span className="text-red-500">*</span>
          </label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="role"
                name="role"
                placeholder={t('signup.role')}
                options={translatedRoleOptions}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        {(watchedRole === 'Autre' || watchedRole === 'Other') && (
          <div>
            <label htmlFor="otherRole" className="block text-sm font-medium text-gray-700 mb-1">
              {t('signup.otherRole')} <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('otherRole')}
              id="otherRole"
              name="otherRole"
              type="text"
              placeholder={t('signup.otherRole')}
            />
            {errors.otherRole && (
              <p className="text-red-500 text-sm mt-1">{errors.otherRole.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyStep2;

