import React from 'react';
import { Controller } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import Select from '../../../components/UI/Select/Select';
import SelectWithSearch from '../../../components/UI/SelectWithSearch/SelectWithSearch';
import { getRegistrationNumberLabel, getRegistrationNumberHelp } from '../../Signup/utils';

const CompanyInfoForm = ({
  register,
  control,
  errors,
  handleSubmit,
  onSubmit,
  onCancel,
  watchedCountry,
  watchedSector,
  allCountries,
  translatedSectorOptions,
  isLoading,
  t,
}) => {

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('account.editCompanyInfo') || 'Edit Company Information'}
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
            {t('account.companyName')} *
          </label>
          <Input
            {...register('name')}
            type="text"
            placeholder={t('account.companyName')}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('account.sector') || t('signup.sector')} *
          </label>
          <Controller
            name="sector"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder={t('signup.sector') || t('account.sector')}
                options={translatedSectorOptions}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.sector && (
            <p className="text-red-500 text-sm mt-1">{errors.sector.message}</p>
          )}
        </div>

        {(watchedSector === 'Autre' || watchedSector === 'Other') && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('signup.otherSector') || 'Other Sector'} *
            </label>
            <Input
              {...register('otherSector')}
              type="text"
              placeholder={t('signup.otherSector') || 'Enter sector name'}
            />
            {errors.otherSector && (
              <p className="text-red-500 text-sm mt-1">{errors.otherSector.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('account.country')} *
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <SelectWithSearch
                {...field}
                placeholder={t('signup.selectCountry') || 'Select Country'}
                options={allCountries}
                maxHeight="200px"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
          )}
        </div>

        {watchedCountry === 'OTHER' && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('signup.otherCountry') || 'Other Country'} *
            </label>
            <Input
              {...register('otherCountry')}
              type="text"
              placeholder={t('signup.otherCountry') || 'Enter country name'}
            />
            {errors.otherCountry && (
              <p className="text-red-500 text-sm mt-1">{errors.otherCountry.message}</p>
            )}
          </div>
        )}

        {watchedCountry && watchedCountry !== 'OTHER' && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {getRegistrationNumberLabel(watchedCountry, t)} *
            </label>
            <Input
              {...register('siret')}
              type="text"
              placeholder={getRegistrationNumberLabel(watchedCountry, t)}
            />
            {errors.siret && (
              <p className="text-red-500 text-sm mt-1">{errors.siret.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {getRegistrationNumberHelp(watchedCountry, t)}
            </p>
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

export default CompanyInfoForm;

