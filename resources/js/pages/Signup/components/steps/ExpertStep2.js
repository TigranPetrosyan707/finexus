import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Input from '../../../../components/UI/Input/Input';
import Button from '../../../../components/UI/Button/Button';
import { colors } from '../../../../constants/colors';

const ExpertStep2 = ({ register, control, errors, t }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workExperience',
  });
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('signup.expert.step2')}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.expert.profession')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('sector')}
            id="sector"
            name="sector"
            type="text"
            placeholder={t('signup.expert.profession')}
          />
          {errors.sector && (
            <p className="text-red-500 text-sm mt-1">{errors.sector.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.expert.experience')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('experience')}
            id="experience"
            name="experience"
            type="text"
            placeholder={t('signup.expert.experience')}
          />
          {errors.experience && (
            <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700 mb-1">
            {t('signup.expert.dailyRate')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('dailyRate')}
            id="dailyRate"
            name="dailyRate"
            type="number"
            placeholder={t('signup.expert.dailyRate')}
          />
          {errors.dailyRate && (
            <p className="text-red-500 text-sm mt-1">{errors.dailyRate.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {t('signup.expert.commissionNote')}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {t('signup.expert.workExperience')}
            </label>
            <Button
              type="button"
              onClick={() => append({ companyName: '', experience: '', role: '', summary: '' })}
              className="flex items-center space-x-2"
              style={{ backgroundColor: colors.linkHover, color: '#fff' }}
            >
              <FaPlus className="w-4 h-4" />
              <span>{t('signup.expert.addExperience')}</span>
            </Button>
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-gray-500 mb-4">{t('signup.expert.noWorkExperience')}</p>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    {t('signup.expert.experience')} {index + 1}
                  </h3>
                  {fields.length > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('signup.expert.companyName')}
                    </label>
                    <Input
                      {...register(`workExperience.${index}.companyName`)}
                      type="text"
                      placeholder={t('signup.expert.companyNamePlaceholder')}
                    />
                    {errors.workExperience?.[index]?.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.workExperience[index].companyName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('signup.expert.experienceDuration')}
                    </label>
                    <Input
                      {...register(`workExperience.${index}.experience`)}
                      type="text"
                      placeholder={t('signup.expert.experienceDurationPlaceholder')}
                    />
                    {errors.workExperience?.[index]?.experience && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.workExperience[index].experience.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('signup.expert.role')}
                    </label>
                    <Input
                      {...register(`workExperience.${index}.role`)}
                      type="text"
                      placeholder={t('signup.expert.rolePlaceholder')}
                    />
                    {errors.workExperience?.[index]?.role && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.workExperience[index].role.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('signup.expert.summary')}
                    </label>
                    <textarea
                      {...register(`workExperience.${index}.summary`)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('signup.expert.summaryPlaceholder')}
                    />
                    {errors.workExperience?.[index]?.summary && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.workExperience[index].summary.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertStep2;

