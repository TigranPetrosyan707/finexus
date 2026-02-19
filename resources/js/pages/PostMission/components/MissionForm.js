import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { DayPicker } from 'react-day-picker';
import { FaTimes, FaCalendarAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import Select from '../../../components/UI/Select/Select';
import MultiSelect from '../../../components/UI/MultiSelect/MultiSelect';
import { getLocationOptions, getSectorOptions, getDocumentOptions } from '../utils';

const MissionForm = ({ 
  register, 
  control, 
  errors, 
  handleSubmit, 
  onSubmit, 
  onCancel, 
  isEditing, 
  watch,
  setValue,
  t 
}) => {
  const minBudget = watch ? (watch('minBudget') || 0) : 0;
  const maxBudget = watch ? (watch('maxBudget') || 1000) : 1000;
  const [showCalendar, setShowCalendar] = useState(false);
  const [requirementInput, setRequirementInput] = useState('');
  const [documentOptions, setDocumentOptions] = useState([]);

  const locationOptions = getLocationOptions(t);
  const sectorOptions = getSectorOptions(t);

  useEffect(() => {
    const options = getDocumentOptions(t);
    setDocumentOptions(options);
  }, [t]);

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? t('postMission.editMission') : t('postMission.createMission')}
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
            {t('postMission.form.title')} <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('title')}
            type="text"
            placeholder={t('postMission.form.titlePlaceholder')}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('postMission.form.description')} <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description')}
            placeholder={t('postMission.form.descriptionPlaceholder')}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col h-full">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('postMission.form.budget')} (€) <span className="text-red-500">*</span>
            </label>
            <div className="rounded-xl p-5 border border-gray-200 flex-1 h-full">
              <div className="text-center mb-4">
                <span className="text-lg font-bold" style={{ color: colors.linkHover }}>
                  {minBudget} € - {maxBudget} €
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-600 font-medium">Minimum</span>
                    <span className="text-sm text-gray-700 font-semibold">{minBudget} €</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={minBudget}
                    {...register('minBudget', { valueAsNumber: true })}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      if (newMin <= maxBudget) {
                        if (setValue) setValue('minBudget', newMin, { shouldValidate: true });
                      } else {
                        const adjustedMin = Math.max(0, maxBudget - 10);
                        if (setValue) setValue('minBudget', adjustedMin, { shouldValidate: true });
                      }
                    }}
                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                      accentColor: colors.linkHover
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-600 font-medium">Maximum</span>
                    <span className="text-sm text-gray-700 font-semibold">{maxBudget} €</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={maxBudget}
                    {...register('maxBudget', { valueAsNumber: true })}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      if (newMax >= minBudget) {
                        if (setValue) setValue('maxBudget', newMax, { shouldValidate: true });
                      } else {
                        const adjustedMax = Math.min(1000, minBudget + 10);
                        if (setValue) setValue('maxBudget', adjustedMax, { shouldValidate: true });
                      }
                    }}
                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                      accentColor: colors.linkHover
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                <span>0 €</span>
                <span>1000 €</span>
              </div>
              {errors.minBudget && (
                <p className="text-red-500 text-sm mt-2">{errors.minBudget.message}</p>
              )}
              {errors.maxBudget && (
                <p className="text-red-500 text-sm mt-2">{errors.maxBudget.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col h-full">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('postMission.form.documents')}
            </label>
            <div className="rounded-xl p-5 border border-gray-200 flex-1 h-full flex flex-col">
              <Controller
                name="documents"
                control={control}
                defaultValue={[]}
                render={({ field }) => {
                  const selectedDocuments = field.value || [];
                  return (
                    <div className="space-y-3 flex-1 flex flex-col">
                      <MultiSelect
                        {...field}
                        options={documentOptions}
                        placeholder={t('postMission.form.documentsPlaceholder')}
                        value={selectedDocuments}
                        onChange={(value) => field.onChange(value)}
                      />
                      {selectedDocuments.length === 0 && (
                        <div className="flex-1 flex items-center justify-center">
                          <p className="text-sm text-gray-500 text-center">
                            {t('postMission.form.noDocumentsInPost')}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('postMission.form.durationDays')} <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('durationDays', { valueAsNumber: true })}
              type="number"
              placeholder={t('postMission.form.durationPlaceholder')}
              min="1"
            />
            {errors.durationDays && (
              <p className="text-red-500 text-sm mt-1">{errors.durationDays.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('postMission.form.startDate')} <span className="text-red-500">*</span>
            </label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => {
                const formatDate = (date) => {
                  if (!date) return '';
                  const d = new Date(date);
                  const day = String(d.getDate()).padStart(2, '0');
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const year = d.getFullYear();
                  return `${day}/${month}/${year}`;
                };

                return (
                  <div className="relative">
                    <div
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent outline-none transition-all text-base cursor-pointer flex items-center justify-between bg-white"
                    >
                      <span className={field.value ? 'text-gray-900' : 'text-gray-400'}>
                        {field.value ? formatDate(field.value) : t('postMission.form.startDatePlaceholder')}
                      </span>
                      <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                    </div>
                    {showCalendar && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowCalendar(false)}
                        />
                        <div className="absolute z-20 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                          <DayPicker
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date);
                              setShowCalendar(false);
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            className="rounded-lg"
                            styles={{
                              day_selected: {
                                backgroundColor: colors.linkHover,
                                color: 'white',
                              },
                              day_today: {
                                color: colors.linkHover,
                                fontWeight: 'bold',
                              },
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              }}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('postMission.form.location')} <span className="text-red-500">*</span>
            </label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={locationOptions}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={t('postMission.form.locationPlaceholder')}
                />
              )}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('postMission.form.section')} <span className="text-red-500">*</span>
            </label>
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={sectorOptions}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (e.target.value !== 'Autre') {
                      setValue('otherSection', '');
                    }
                  }}
                  placeholder={t('postMission.form.sectionPlaceholder')}
                />
              )}
            />
            {errors.section && (
              <p className="text-red-500 text-sm mt-1">{errors.section.message}</p>
            )}
            {watch('section') === 'Autre' && (
              <div className="mt-3">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('postMission.form.otherSection')} <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('otherSection')}
                  type="text"
                  placeholder={t('postMission.form.otherSectionPlaceholder')}
                />
                {errors.otherSection && (
                  <p className="text-red-500 text-sm mt-1">{errors.otherSection.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {t('postMission.form.requirements')}
          </label>
          <Controller
            name="requirements"
            control={control}
            defaultValue={[]}
            render={({ field }) => {
              const handleAddRequirement = () => {
                if (requirementInput.trim()) {
                  const currentValue = field.value || [];
                  field.onChange([...currentValue, requirementInput.trim()]);
                  setRequirementInput('');
                }
              };

              const handleRemoveRequirement = (index) => {
                const currentValue = field.value || [];
                field.onChange(currentValue.filter((_, i) => i !== index));
              };

              const handleKeyPress = (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddRequirement();
                }
              };

              return (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('postMission.form.requirementPlaceholder')}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddRequirement}
                      className="flex items-center space-x-2"
                      style={{ backgroundColor: colors.linkHover, color: '#fff' }}
                    >
                      <FaPlus className="w-4 h-4" />
                      <span>{t('postMission.form.addRequirement')}</span>
                    </Button>
                  </div>
                  {field.value && field.value.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {field.value.map((requirement, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all relative group"
                        >
                          <span className="text-sm text-gray-700">{requirement}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRequirement(index)}
                            className="flex items-center justify-center text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                            title={t('postMission.form.removeRequirement')}
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1"
            style={{ backgroundColor: colors.linkHover, color: '#fff' }}
          >
            {isEditing ? t('postMission.update') : t('postMission.create')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            {t('postMission.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MissionForm;

