import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { FaUpload, FaImage } from 'react-icons/fa';
import Input from '../../../../components/UI/Input/Input';
import Select from '../../../../components/UI/Select/Select';
import Button from '../../../../components/UI/Button/Button';
import { colors } from '../../../../constants/colors';
import { getRegistrationNumberLabel, getRegistrationNumberHelp } from '../../utils';

const CompanyStep1 = ({ register, control, errors, watchedSector, watchedCountry, translatedSectorOptions, t, i18n, watch }) => {
  const watchedLogo = watch('companyLogo');
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (watchedLogo && watchedLogo.length > 0) {
      const file = watchedLogo[0] || watchedLogo;
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setLogoPreview(null);
    }
  }, [watchedLogo]);
  const countryOptions = [
    { value: 'FRANCE', label: 'France' },
    { value: 'GERMANY', label: 'Germany' },
    { value: 'BELGIUM', label: 'Belgium' },
    { value: 'ENGLAND', label: 'England' },
    { value: 'SWITZERLAND', label: 'Switzerland' },
    { value: 'OTHER', label: i18n.language === 'en' ? 'Other' : 'Autre' },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('signup.step1')}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.companyLogo')}
          </label>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.linkHover}15` }}>
                  <FaImage className="w-6 h-6" style={{ color: colors.linkHover }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {t('signup.companyLogo')}
                  </h3>
                  <p className="text-sm text-gray-600">JPG, PNG, GIF</p>
                  {logoPreview ? (
                    <div className="mt-2">
                      <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-contain rounded" />
                    </div>
                  ) : watchedLogo && watchedLogo.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      {t('signup.logoSelected')}: {watchedLogo[0]?.name || watchedLogo.name}
                    </p>
                  )}
                </div>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  {...register('companyLogo')}
                  id="companyLogo"
                  name="companyLogo"
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  className="flex items-center space-x-2"
                  style={{ backgroundColor: colors.linkHover, color: '#fff' }}
                  onClick={() => document.getElementById('companyLogo').click()}
                >
                  <FaUpload className="w-5 h-5" />
                  <span>{t('signup.chooseLogo')}</span>
                </Button>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="rs" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.companyName')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('rs')}
            id="rs"
            name="rs"
            type="text"
            placeholder={t('signup.companyName')}
          />
          {errors.rs && (
            <p className="text-red-500 text-sm mt-1">{errors.rs.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.sector')} <span className="text-red-500">*</span>
          </label>
          <Controller
            name="sector"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="sector"
                name="sector"
                placeholder={t('signup.selectSector')}
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
            <label htmlFor="otherSector" className="block text-sm font-medium text-gray-700 mb-1">
              {t('signup.otherSector')} <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('otherSector')}
              id="otherSector"
              name="otherSector"
              type="text"
              placeholder={t('signup.otherSector')}
            />
            {errors.otherSector && (
              <p className="text-red-500 text-sm mt-1">{errors.otherSector.message}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.country')} <span className="text-red-500">*</span>
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="country"
                name="country"
                placeholder={t('signup.selectCountry')}
                options={countryOptions}
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
            <label htmlFor="otherCountry" className="block text-sm font-medium text-gray-700 mb-1">
              {t('signup.otherCountry')} <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('otherCountry')}
              id="otherCountry"
              name="otherCountry"
              type="text"
              placeholder={t('signup.otherCountry')}
            />
            {errors.otherCountry && (
              <p className="text-red-500 text-sm mt-1">{errors.otherCountry.message}</p>
            )}
          </div>
        )}

        {watchedCountry && watchedCountry !== 'OTHER' && (
          <div>
            <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">
              {getRegistrationNumberLabel(watchedCountry, t)} <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('siret')}
              id="siret"
              name="siret"
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
      </div>
    </div>
  );
};

export default CompanyStep1;

