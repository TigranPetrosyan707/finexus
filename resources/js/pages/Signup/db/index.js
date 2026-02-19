import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { userDB, db } from '../../../utils/database';
import { SIGNUP_ERRORS } from '../constants';
import { createUserSchema } from './schema';

const signupDB = {
  async createUser(role, formData) {
    const structuredUserData = await createUserSchema(role, formData);
    return await userDB.createUser(structuredUserData);
  },

  async checkEmailExists(email, role) {
    const user = await userDB.getUserByEmailAndRole(email, role);
    return !!user;
  },
};

export const useSignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleNext = async (data, trigger, setFormError, t) => {
    setFormError('root', { message: '' });
    setFormError('email', { message: '' });

    let isValid = false;
    
    if (selectedRole === 'expert') {
      if (currentStep === 1) {
        isValid = await trigger('firstname', 'lastname', 'email', 'phone', 'linkedin');
        if (isValid && data.email) {
          const emailExists = await signupDB.checkEmailExists(data.email, selectedRole);
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
          const emailExists = await signupDB.checkEmailExists(data.email, selectedRole);
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

    try {
      const emailExists = await signupDB.checkEmailExists(data.email, selectedRole);
      if (emailExists) {
        setFormError('email', {
          type: 'manual',
          message: t(SIGNUP_ERRORS.EMAIL_EXISTS) || 'This email is already registered with this account type',
        });
        setLoading(false);
        return;
      }

      const newUser = await signupDB.createUser(selectedRole, data);
      await db.set('currentUser', newUser);
      login(selectedRole);
      navigate('/');
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

