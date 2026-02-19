import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/UI/Button/Button';

const FormNavigation = ({ currentStep, onPrevious, loading, isStepValid = false }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center">
      {currentStep > 1 ? (
        <Button
          type="button"
          onClick={onPrevious}
          variant="secondary"
          className="px-6 py-3"
          disabled={loading}
        >
          {t('signup.previous')}
        </Button>
      ) : (
        <div></div>
      )}

      {currentStep < 3 ? (
        <Button
          type="submit"
          className="ml-auto"
          disabled={loading || !isStepValid}
        >
          {loading ? t('common.loading') || 'Loading...' : t('signup.next')}
        </Button>
      ) : (
        <Button
          type="submit"
          className="ml-auto"
          disabled={loading || !isStepValid}
        >
          {loading ? t('common.loading') || 'Loading...' : t('signup.submit')}
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;

