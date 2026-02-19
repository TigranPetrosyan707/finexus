import React from 'react';
import CompanyStep1 from './steps/CompanyStep1';
import CompanyStep2 from './steps/CompanyStep2';
import CompanyStep3 from './steps/CompanyStep3';
import ExpertStep1 from './steps/ExpertStep1';
import ExpertStep2 from './steps/ExpertStep2';
import ExpertStep3 from './steps/ExpertStep3';

const FormSteps = ({
  selectedRole,
  currentStep,
  register,
  control,
  errors,
  watchedSector,
  watchedCountry,
  watchedRole,
  watchedResume,
  translatedSectorOptions,
  translatedRoleOptions,
  t,
  i18n,
  watch,
}) => {
  if (selectedRole === 'expert') {
    switch (currentStep) {
      case 1:
        return <ExpertStep1 register={register} errors={errors} watchedResume={watchedResume} t={t} watch={watch} />;
      case 2:
        return <ExpertStep2 register={register} control={control} errors={errors} t={t} />;
      case 3:
        return <ExpertStep3 register={register} errors={errors} t={t} watch={watch} />;
      default:
        return null;
    }
  }

  if (selectedRole === 'company') {
    switch (currentStep) {
      case 1:
        return (
          <CompanyStep1
            register={register}
            control={control}
            errors={errors}
            watchedSector={watchedSector}
            watchedCountry={watchedCountry}
            translatedSectorOptions={translatedSectorOptions}
            t={t}
            i18n={i18n}
            watch={watch}
          />
        );
      case 2:
        return (
          <CompanyStep2
            register={register}
            control={control}
            errors={errors}
            watchedRole={watchedRole}
            translatedRoleOptions={translatedRoleOptions}
            t={t}
          />
        );
      case 3:
        return <CompanyStep3 register={register} errors={errors} t={t} watch={watch} />;
      default:
        return null;
    }
  }

  return null;
};

export default FormSteps;

