import React, { useMemo, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSignupForm } from './db';
import {
  createCompanyStep1Schema,
  createCompanyStep2Schema,
  createCompanyStep3Schema,
  createExpertStep1Schema,
  createExpertStep2Schema,
  createExpertStep3Schema,
} from './validation';
import {
  getTranslatedOptions,
  getTranslatedRoleOptions,
} from './utils';
import { colors } from '../../constants/colors';
import { sectorOptions } from '../../constants/formOptions';
import RoleSelection from './components/RoleSelection';
import ProgressIndicator from './components/ProgressIndicator';
import FormSteps from './components/FormSteps';
import FormNavigation from './components/FormNavigation';

const SIGNUP_STORAGE_KEY = 'signup_form_data';

const Signup = () => {
  const { t, i18n } = useTranslation();
  const { url } = usePage();
  const {
    loading,
    selectedRole,
    setSelectedRole,
    currentStep,
    setCurrentStep,
    handleNext,
    handlePrevious,
    handleSubmit: handleFormSubmit,
  } = useSignupForm();

  const getCurrentSchema = () => {
    if (!selectedRole) return null;
    if (selectedRole === 'expert') {
      if (currentStep === 1) return createExpertStep1Schema(t);
      if (currentStep === 2) return createExpertStep2Schema(t);
      if (currentStep === 3) return createExpertStep3Schema(t);
    } else {
      if (currentStep === 1) return createCompanyStep1Schema(t);
      if (currentStep === 2) return createCompanyStep2Schema(t);
      if (currentStep === 3) return createCompanyStep3Schema(t);
    }
    return null;
  };

  const schema = getCurrentSchema();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError: setFormError,
    trigger,
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const allFormValues = watch();
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  useEffect(() => {
    const savedData = sessionStorage.getItem(SIGNUP_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.selectedRole) {
          setSelectedRole(parsed.selectedRole);
        }
        if (parsed.currentStep) {
          setCurrentStep(parsed.currentStep);
        }
        setIsInitialLoad(false);
        if (parsed.formData && Object.keys(parsed.formData).length > 0) {
          setTimeout(() => {
            Object.keys(parsed.formData).forEach((key) => {
              if (parsed.formData[key] !== undefined && parsed.formData[key] !== null) {
                setValue(key, parsed.formData[key], { shouldValidate: false });
              }
            });
          }, 100);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
        setIsInitialLoad(false);
      }
    } else {
      setIsInitialLoad(false);
    }
  }, [setSelectedRole, setCurrentStep, setValue]);

  useEffect(() => {
    if (selectedRole && !isInitialLoad) {
      const savedData = sessionStorage.getItem(SIGNUP_STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.formData && parsed.selectedRole === selectedRole) {
            Object.keys(parsed.formData).forEach((key) => {
              setValue(key, parsed.formData[key], { shouldValidate: false });
            });
          } else if (parsed.selectedRole !== selectedRole) {
            reset();
          }
        } catch (error) {
          reset();
        }
      } else {
        reset();
      }
    }
  }, [selectedRole, reset, setValue, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad && selectedRole && allFormValues) {
      const saveFormData = () => {
        const formDataToSave = { ...allFormValues };
        delete formDataToSave.photo;
        delete formDataToSave.resume;
        delete formDataToSave.companyLogo;
        
        const dataToSave = {
          selectedRole,
          currentStep,
          formData: formDataToSave,
        };
        sessionStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(dataToSave));
      };

      const timeoutId = setTimeout(saveFormData, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedRole, currentStep, allFormValues, isInitialLoad]);

  useEffect(() => {
    if (url !== '/signup') {
      sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
    }
  }, [url]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
    };
  }, []);

  const watchedCountry = watch('country');
  const watchedSector = watch('sector');
  const watchedRole = watch('role');
  const watchedResume = watch('resume');
  
  const watchedFirstname = watch('firstname');
  const watchedLastname = watch('lastname');
  const watchedEmail = watch('email');
  const watchedPhone = watch('phone');
  const watchedLinkedin = watch('linkedin');
  const watchedRs = watch('rs');
  const watchedSiret = watch('siret');
  const watchedOtherCountry = watch('otherCountry');
  const watchedOtherSector = watch('otherSector');
  const watchedOtherRole = watch('otherRole');
  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');

  const isCurrentStepValid = useMemo(() => {
    if (!selectedRole || !schema) return false;

    if (selectedRole === 'expert') {
      if (currentStep === 1) {
        const allRequiredFilled = 
          watchedFirstname && watchedFirstname.trim() !== '' &&
          watchedLastname && watchedLastname.trim() !== '' &&
          watchedEmail && watchedEmail.trim() !== '' &&
          watchedPhone && watchedPhone.trim() !== '';
        
        if (!allRequiredFilled) return false;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(watchedEmail)) {
          return false;
        }

        if (watchedLinkedin && watchedLinkedin.trim() !== '') {
          try {
            new URL(watchedLinkedin);
          } catch {
            return false;
          }
        }

        return true;
      } else if (currentStep === 2) {
        const sector = allFormValues.sector;
        const experience = allFormValues.experience;
        const dailyRate = allFormValues.dailyRate;
        
        if (!sector || String(sector).trim() === '') return false;
        if (!experience || String(experience).trim() === '') return false;
        if (dailyRate === undefined || dailyRate === null || dailyRate === '') return false;
        if (String(dailyRate).trim() === '' || String(dailyRate).trim() === '0') return false;
        
        return true;
      } else if (currentStep === 3) {
        if (!watchedPassword || watchedPassword.trim() === '') return false;
        if (!watchedConfirmPassword || watchedConfirmPassword.trim() === '') return false;
        
        if (watchedPassword.length < 8) return false;
        
        const hasUpperCase = /[A-Z]/.test(watchedPassword);
        const hasLowerCase = /[a-z]/.test(watchedPassword);
        const hasSymbol = /[^a-zA-Z0-9]/.test(watchedPassword);
        
        if (!hasUpperCase || !hasLowerCase || !hasSymbol) return false;
        
        return watchedPassword === watchedConfirmPassword;
      }
    } else {
      if (currentStep === 1) {
        const baseFieldsValid = 
          watchedRs && watchedRs.trim() !== '' &&
          watchedSector && watchedSector.trim() !== '' &&
          watchedCountry && watchedCountry.trim() !== '';

        if (!baseFieldsValid) return false;

        if (watchedCountry && watchedCountry !== 'OTHER') {
          if (!watchedSiret || watchedSiret.trim() === '') {
            return false;
          }
        } else if (watchedCountry === 'OTHER') {
          if (!watchedOtherCountry || watchedOtherCountry.trim() === '') {
            return false;
          }
        }

        if (watchedSector === 'Autre' || watchedSector === 'Other') {
          if (!watchedOtherSector || watchedOtherSector.trim() === '') {
            return false;
          }
        }

        return true;
      } else if (currentStep === 2) {
        const allRequiredFilled = 
          watchedFirstname && watchedFirstname.trim() !== '' &&
          watchedLastname && watchedLastname.trim() !== '' &&
          watchedEmail && watchedEmail.trim() !== '' &&
          watchedPhone && watchedPhone.trim() !== '' &&
          watchedRole && watchedRole.trim() !== '';

        if (!allRequiredFilled) return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(watchedEmail)) {
          return false;
        }

        if (watchedRole === 'Autre' || watchedRole === 'Other') {
          if (!watchedOtherRole || watchedOtherRole.trim() === '') {
            return false;
          }
        }

        return true;
      } else if (currentStep === 3) {
        if (!watchedPassword || watchedPassword.trim() === '') return false;
        if (!watchedConfirmPassword || watchedConfirmPassword.trim() === '') return false;
        
        if (watchedPassword.length < 8) return false;
        
        const hasUpperCase = /[A-Z]/.test(watchedPassword);
        const hasLowerCase = /[a-z]/.test(watchedPassword);
        const hasSymbol = /[^a-zA-Z0-9]/.test(watchedPassword);
        
        if (!hasUpperCase || !hasLowerCase || !hasSymbol) return false;
        
        return watchedPassword === watchedConfirmPassword;
      }
    }

    return false;
  }, [
    selectedRole,
    currentStep,
    schema,
    watchedFirstname,
    watchedLastname,
    watchedEmail,
    watchedPhone,
    watchedLinkedin,
    watchedRs,
    watchedSector,
    watchedCountry,
    watchedSiret,
    watchedOtherCountry,
    watchedOtherSector,
    watchedRole,
    watchedOtherRole,
    watchedPassword,
    watchedConfirmPassword,
    allFormValues,
  ]);

  const translatedSectorOptions = useMemo(
    () => getTranslatedOptions(sectorOptions, i18n),
    [i18n]
  );

  const translatedRoleOptions = useMemo(
    () => getTranslatedRoleOptions(t, i18n),
    [t, i18n]
  );

  const onSubmit = async (data) => {
    if (currentStep < 3) {
      await handleNext(data, trigger, setFormError, t);
    } else {
      sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
      await handleFormSubmit(data, setFormError, t);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f5f6fa' }}>
      <div className="bg-white rounded-xl p-8 lg:p-10 shadow-lg border border-gray-200 w-full max-w-lg">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
          {t('signup.title')}
        </h1>

        <RoleSelection selectedRole={selectedRole} onSelectRole={setSelectedRole} />

        <ProgressIndicator currentStep={currentStep} />

        <form onSubmit={handleSubmit(onSubmit)}>
          {selectedRole && (
            <div className="mb-8 min-h-[300px]">
              <FormSteps
                selectedRole={selectedRole}
                currentStep={currentStep}
                register={register}
                control={control}
                errors={errors}
                watchedSector={watchedSector}
                watchedCountry={watchedCountry}
                watchedRole={watchedRole}
                watchedResume={watchedResume}
                translatedSectorOptions={translatedSectorOptions}
                translatedRoleOptions={translatedRoleOptions}
                t={t}
                i18n={i18n}
                watch={watch}
              />
            </div>
          )}

          {selectedRole && (
            <FormNavigation
              currentStep={currentStep}
              onPrevious={handlePrevious}
              loading={loading}
              isStepValid={isCurrentStepValid}
            />
          )}

          <p className="text-center text-gray-600 mt-6">
            {t('signup.hasAccount')}{' '}
            <Link
              to="/login"
              className="font-bold transition-colors hover:opacity-80"
              style={{ color: colors.buttonBackground }}
            >
              {t('signup.login')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
