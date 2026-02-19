import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountDB } from '../db';
import { formatCompanyInfo, formatUserInfo } from '../db/schema';
import { createPasswordChangeSchema, createCompanyInfoSchema, createUserInfoSchema } from '../validation';
import { ACCOUNT_ERRORS } from '../constants';
import toast from 'react-hot-toast';

export const useAccount = (t, userRole) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  const passwordForm = useForm({
    resolver: yupResolver(createPasswordChangeSchema(t)),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const companyForm = useForm({
    resolver: yupResolver(createCompanyInfoSchema(t)),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const userForm = useForm({
    resolver: yupResolver(createUserInfoSchema(t)),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const loadAccountData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await accountDB.getCurrentUser();
      
      if (user) {
        setCurrentUser(user);
        const formattedCompanyInfo = formatCompanyInfo(user);
        const formattedUserInfo = formatUserInfo(user);
        setCompanyInfo(formattedCompanyInfo);
        setUserInfo(formattedUserInfo);
        
        if (formattedCompanyInfo && formattedCompanyInfo.name) {
          let countryCode = formattedCompanyInfo.country;
          if (countryCode === 'France') countryCode = 'FR';
          else if (countryCode === 'Belgique') countryCode = 'BE';
          else if (countryCode === 'Suisse') countryCode = 'CH';
          else if (countryCode === 'Luxembourg') countryCode = 'LU';
          else if (countryCode === 'Canada') countryCode = 'CA';
          else if (countryCode === 'Autre') countryCode = 'OTHER';
          
          companyForm.reset({
            name: formattedCompanyInfo.name,
            sector: formattedCompanyInfo.sector || '',
            otherSector: user.companyInfo?.otherSector || '',
            country: countryCode || '',
            otherCountry: user.companyInfo?.otherCountry || '',
            siret: formattedCompanyInfo.siret || '',
          });
        }
        
        if (formattedUserInfo) {
          userForm.reset({
            firstname: formattedUserInfo.firstname,
            lastname: formattedUserInfo.lastname,
            email: formattedUserInfo.email,
            phone: formattedUserInfo.phone,
            role: formattedUserInfo.role || '',
          });
        }
      }
    } catch (error) {
      console.error('Error loading account data:', error);
      toast.error(t(ACCOUNT_ERRORS.LOAD_ERROR) || 'Failed to load account data');
    } finally {
      setLoading(false);
    }
  }, [t, companyForm, userForm]);

  useEffect(() => {
    loadAccountData();
  }, [loadAccountData]);

  const handlePasswordSubmit = async (formData) => {
    if (!currentUser) {
      passwordForm.setError('root', {
        type: 'manual',
        message: t(ACCOUNT_ERRORS.LOAD_ERROR) || 'User not found',
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await accountDB.updatePassword(
        currentUser.id,
        formData.oldPassword,
        formData.newPassword
      );
      
      toast.success(t('changePassword.success') || 'Password updated successfully');
      passwordForm.reset({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
      await loadAccountData();
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.message === 'Current password is incorrect') {
        passwordForm.setError('oldPassword', {
          type: 'manual',
          message: t(ACCOUNT_ERRORS.PASSWORD_INCORRECT) || 'Current password is incorrect',
        });
      } else {
        passwordForm.setError('root', {
          type: 'manual',
          message: t(ACCOUNT_ERRORS.PASSWORD_UPDATE_ERROR) || 'Failed to update password',
        });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCompanySubmit = async (formData) => {
    if (!currentUser) {
      companyForm.setError('root', {
        type: 'manual',
        message: t(ACCOUNT_ERRORS.LOAD_ERROR) || 'User not found',
      });
      return;
    }

    setIsUpdatingCompany(true);
    try {
      await accountDB.updateCompanyInfo(currentUser.id, formData);
      toast.success(t('account.companyUpdateSuccess') || 'Company information updated successfully');
      setShowCompanyForm(false);
      await loadAccountData();
    } catch (error) {
      console.error('Error updating company info:', error);
      companyForm.setError('root', {
        type: 'manual',
        message: t(ACCOUNT_ERRORS.COMPANY_UPDATE_ERROR) || 'Failed to update company information',
      });
    } finally {
      setIsUpdatingCompany(false);
    }
  };

  const handleUserSubmit = async (formData) => {
    if (!currentUser) {
      userForm.setError('root', {
        type: 'manual',
        message: t(ACCOUNT_ERRORS.LOAD_ERROR) || 'User not found',
      });
      return;
    }

    setIsUpdatingUser(true);
    try {
      await accountDB.updateUserInfo(currentUser.id, formData, userRole);
      toast.success(t('account.userUpdateSuccess') || 'User information updated successfully');
      setShowUserForm(false);
      await loadAccountData();
    } catch (error) {
      console.error('Error updating user info:', error);
      userForm.setError('root', {
        type: 'manual',
        message: t(ACCOUNT_ERRORS.USER_UPDATE_ERROR) || 'Failed to update user information',
      });
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleCancelPassword = () => {
    passwordForm.reset({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordForm(false);
  };

  const handleCancelCompany = () => {
    if (companyInfo && currentUser) {
      let countryCode = companyInfo.country;
      if (countryCode === 'France') countryCode = 'FR';
      else if (countryCode === 'Belgique') countryCode = 'BE';
      else if (countryCode === 'Suisse') countryCode = 'CH';
      else if (countryCode === 'Luxembourg') countryCode = 'LU';
      else if (countryCode === 'Canada') countryCode = 'CA';
      else if (countryCode === 'Autre') countryCode = 'OTHER';
      
      companyForm.reset({
        name: companyInfo.name,
        sector: companyInfo.sector || '',
        otherSector: currentUser.companyInfo?.otherSector || '',
        country: countryCode || '',
        otherCountry: currentUser.companyInfo?.otherCountry || '',
        siret: companyInfo.siret || '',
      });
    }
    setShowCompanyForm(false);
  };

  const handleCancelUser = () => {
    if (userInfo) {
      userForm.reset({
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        email: userInfo.email,
        phone: userInfo.phone,
        role: userInfo.role || '',
      });
    }
    setShowUserForm(false);
  };

  return {
    loading,
    currentUser,
    companyInfo,
    userInfo,
    showPasswordForm,
    showCompanyForm,
    showUserForm,
    isUpdatingPassword,
    isUpdatingCompany,
    isUpdatingUser,
    passwordForm: {
      register: passwordForm.register,
      handleSubmit: passwordForm.handleSubmit,
      errors: passwordForm.formState.errors,
    },
    companyForm: {
      register: companyForm.register,
      control: companyForm.control,
      handleSubmit: companyForm.handleSubmit,
      errors: companyForm.formState.errors,
      watch: companyForm.watch,
    },
    userForm: {
      register: userForm.register,
      handleSubmit: userForm.handleSubmit,
      errors: userForm.formState.errors,
    },
    handlePasswordSubmit,
    handleCompanySubmit,
    handleUserSubmit,
    handleCancelPassword,
    handleCancelCompany,
    handleCancelUser,
    handleShowPasswordForm: () => setShowPasswordForm(true),
    handleShowCompanyForm: () => setShowCompanyForm(true),
    handleShowUserForm: () => setShowUserForm(true),
    loadAccountData,
  };
};
