import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useAuth } from '../../../context/AuthContext';
import { userDB, db } from '../../../utils/database';
import { LOGIN_ERRORS } from '../constants';

const loginDB = {
  async getUserByEmailAndRole(email, role) {
    return await userDB.getUserByEmailAndRole(email, role);
  },

  async getUserByEmail(email) {
    return await userDB.getUserByEmail(email);
  },

  async saveCurrentUser(user) {
    return await db.set('currentUser', user);
  },
};

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

    try {
      const user = await loginDB.getUserByEmailAndRole(data.email, selectedRole);
      
      if (!user) {
        const userExists = await loginDB.getUserByEmail(data.email);
        if (userExists) {
          setFormError('role', {
            type: 'manual',
            message: t(LOGIN_ERRORS.WRONG_ROLE) || `This email is registered as ${userExists.role}, not as ${selectedRole}. Please select the correct role.`,
          });
        } else {
          setFormError('email', {
            type: 'manual',
            message: t(LOGIN_ERRORS.USER_NOT_FOUND) || 'User not found. Please sign up first.',
          });
        }
        return;
      }

      if (user.password !== data.password) {
        setFormError('password', {
          type: 'manual',
          message: t(LOGIN_ERRORS.WRONG_PASSWORD) || 'Incorrect password',
        });
        return;
      }

      await loginDB.saveCurrentUser(user);
      login(selectedRole);
      router.visit('/');
    } catch (err) {
      console.error('Login error:', err);
      setFormError('root', {
        type: 'manual',
        message: t(LOGIN_ERRORS.GENERIC_ERROR) || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    selectedRole,
    setSelectedRole,
    handleLogin,
  };
};

