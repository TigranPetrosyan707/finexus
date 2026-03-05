import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useAuth } from '../../../context/AuthContext';
import { SIGNUP_ERRORS } from '../constants';

const API_BASE = '';

function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function checkEmailExists(email, role) {
  const res = await fetch(`${API_BASE}/users/check-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-TOKEN': getCsrfToken() || '',
    },
    body: JSON.stringify({ email, role }),
    credentials: 'include',
  });
  const data = await res.json();
  return data.exists === true;
}

function buildPayload(selectedRole, data) {
  const payload = {
    role: selectedRole,
    email: data.email,
    password: data.password,
    password_confirmation: data.confirmPassword,
    firstname: data.firstname ?? '',
    lastname: data.lastname ?? '',
    phone: data.phone ?? '',
  };

  if (selectedRole === 'company') {
    payload.rs = data.rs ?? '';
    payload.sector = data.sector ?? '';
    payload.country = data.country ?? '';
    payload.siret = data.siret ?? '';
    payload.otherCountry = data.otherCountry ?? '';
    payload.otherSector = data.otherSector ?? '';
    payload.role_manager = data.role ?? '';
    payload.otherRole = data.otherRole ?? '';
  }

  if (selectedRole === 'expert') {
    payload.sector = data.sector ?? '';
    payload.experience = data.experience ?? '';
    payload.dailyRate = data.dailyRate != null && data.dailyRate !== '' ? Number(data.dailyRate) : null;
    payload.linkedin = data.linkedin || null;
    if (data.resume && (data.resume[0] instanceof File || data.resume instanceof File)) {
      payload.resume = data.resume[0] || data.resume;
    }
  }

  return payload;
}

export const useSignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { login } = useAuth();

  const handleNext = async (data, trigger, setFormError, t) => {
    setFormError('root', { message: '' });
    setFormError('email', { message: '' });

    let isValid = false;

    if (selectedRole === 'expert') {
      if (currentStep === 1) {
        isValid = await trigger('firstname', 'lastname', 'email', 'phone', 'linkedin');
        if (isValid && data.email) {
          const emailExists = await checkEmailExists(data.email, selectedRole);
          if (emailExists) {
            setFormError('email', {
              type: 'manual',
              message: t(SIGNUP_ERRORS.EMAIL_EXISTS) || 'This email is already registered with this account type',
            });
            return;
          }
        }
      } else if (currentStep === 2) {
        isValid = await trigger('sector', 'experience', 'dailyRate');
      }
    } else {
      if (currentStep === 1) {
        isValid = await trigger('rs', 'sector', 'country', 'siret', 'otherCountry', 'otherSector');
      } else if (currentStep === 2) {
        isValid = await trigger('firstname', 'lastname', 'email', 'phone', 'role', 'otherRole');
        if (isValid && data.email) {
          const emailExists = await checkEmailExists(data.email, selectedRole);
          if (emailExists) {
            setFormError('email', {
              type: 'manual',
              message: t(SIGNUP_ERRORS.EMAIL_EXISTS) || 'This email is already registered with this account type',
            });
            return;
          }
        }
      }
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (data, setFormError, t) => {
    if (!selectedRole) {
      setFormError('root', {
        type: 'manual',
        message: t(SIGNUP_ERRORS.SELECT_ROLE) || 'Please select a role',
      });
      return;
    }

    setLoading(true);
    setFormError('root', { message: '' });
    setFormError('email', { message: '' });

    try {
      const emailExists = await checkEmailExists(data.email, selectedRole);
      if (emailExists) {
        setFormError('email', {
          type: 'manual',
          message: t(SIGNUP_ERRORS.EMAIL_EXISTS) || 'This email is already registered with this account type',
        });
        setLoading(false);
        return;
      }

      const payload = buildPayload(selectedRole, data);

      router.post('/users/store', payload, {
        preserveScroll: true,
        onSuccess: () => {
          login(selectedRole);
        },
        onError: (errors) => {
          if (errors && typeof errors === 'object') {
            Object.keys(errors).forEach((field) => {
              setFormError(field, { type: 'manual', message: Array.isArray(errors[field]) ? errors[field][0] : errors[field] });
            });
          } else {
            setFormError('root', { type: 'manual', message: t(SIGNUP_ERRORS.GENERIC_ERROR) || 'An error occurred. Please try again.' });
          }
        },
        onFinish: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      console.error('Signup error:', err);
      setFormError('root', {
        type: 'manual',
        message: err.message || t(SIGNUP_ERRORS.GENERIC_ERROR) || 'An error occurred. Please try again.',
      });
      setLoading(false);
    }
  };

  return {
    loading,
    selectedRole,
    setSelectedRole,
    currentStep,
    setCurrentStep,
    handleNext,
    handlePrevious,
    handleSubmit,
    setLoading,
  };
};
