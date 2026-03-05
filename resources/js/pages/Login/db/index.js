import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useAuth } from '../../../context/AuthContext';
import { LOGIN_ERRORS } from '../constants';

export const useLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { login } = useAuth();

  const handleLogin = async (data, setFormError, t) => {
    if (!selectedRole) {
      setFormError('role', {
        type: 'manual',
        message: t(LOGIN_ERRORS.SELECT_ROLE) || 'Please select a role',
      });
      return;
    }

    setLoading(true);
    setFormError('root', { message: '' });
    setFormError('role', { message: '' });
    setFormError('email', { message: '' });
    setFormError('password', { message: '' });

    router.post('/login', {
      email: data.email,
      password: data.password,
      role: selectedRole,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        login(selectedRole === 'demo' ? 'company' : selectedRole);
      },
      onError: (errors) => {
        if (errors && typeof errors === 'object') {
          Object.keys(errors).forEach((field) => {
            const msg = Array.isArray(errors[field]) ? errors[field][0] : errors[field];
            setFormError(field, { type: 'server', message: msg });
          });
        } else {
          setFormError('root', { type: 'manual', message: t(LOGIN_ERRORS.GENERIC_ERROR) || 'An error occurred. Please try again.' });
        }
      },
      onFinish: () => {
        setLoading(false);
      },
    });
  };

  return {
    loading,
    selectedRole,
    setSelectedRole,
    handleLogin,
  };
};
