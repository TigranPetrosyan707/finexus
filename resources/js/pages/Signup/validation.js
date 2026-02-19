import * as yup from 'yup';
import { SIGNUP_VALIDATION } from './constants';

export const createCompanyStep1Schema = (t) => {
  return yup.object().shape({
    rs: yup
      .string()
      .required(t(SIGNUP_VALIDATION.COMPANY_NAME_REQUIRED) || 'Company name is required'),
    sector: yup
      .string()
      .required(t(SIGNUP_VALIDATION.SECTOR_REQUIRED) || 'Sector is required'),
    country: yup
      .string()
      .required(t(SIGNUP_VALIDATION.COUNTRY_REQUIRED) || 'Country is required'),
    siret: yup
      .string()
      .when('country', {
        is: (country) => country && country !== 'OTHER',
        then: (schema) => schema.required(t(SIGNUP_VALIDATION.SIRET_REQUIRED) || 'Registration number is required'),
      }),
    otherCountry: yup
      .string()
      .when('country', {
        is: 'OTHER',
        then: (schema) => schema.required(t('signup.specifyCountry') || 'Please specify the country'),
      }),
    otherSector: yup
      .string()
      .when('sector', {
        is: (sector) => sector === 'Autre' || sector === 'Other',
        then: (schema) => schema.required(t('signup.specifySector') || 'Please specify the sector'),
      }),
  });
};

export const createCompanyStep2Schema = (t) => {
  return yup.object().shape({
    firstname: yup
      .string()
      .required(t(SIGNUP_VALIDATION.FIRSTNAME_REQUIRED) || 'First name is required'),
    lastname: yup
      .string()
      .required(t(SIGNUP_VALIDATION.LASTNAME_REQUIRED) || 'Last name is required'),
    email: yup
      .string()
      .required(t(SIGNUP_VALIDATION.EMAIL_REQUIRED) || 'Email is required')
      .email(t(SIGNUP_VALIDATION.EMAIL_INVALID) || 'Invalid email address'),
    phone: yup
      .string()
      .required(t(SIGNUP_VALIDATION.PHONE_REQUIRED) || 'Phone number is required'),
    role: yup
      .string()
      .required(t(SIGNUP_VALIDATION.ROLE_REQUIRED) || 'Role is required'),
    otherRole: yup
      .string()
      .when('role', {
        is: (role) => role === 'Autre' || role === 'Other',
        then: (schema) => schema.required(t('signup.specifyRole') || 'Please specify the role'),
      }),
  });
};

export const createCompanyStep3Schema = (t) => {
  return yup.object().shape({
    password: yup
      .string()
      .required(t(SIGNUP_VALIDATION.PASSWORD_REQUIRED) || 'Password is required')
      .min(8, t('signup.passwordMinLength') || 'Password must contain at least 8 characters')
      .matches(/[A-Z]/, t('signup.passwordUppercase') || 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, t('signup.passwordLowercase') || 'Password must contain at least one lowercase letter')
      .matches(/[^a-zA-Z0-9]/, t('signup.passwordSymbol') || 'Password must contain at least one symbol'),
    confirmPassword: yup
      .string()
      .required(t('signup.confirmPasswordRequired') || 'Please confirm your password')
      .oneOf([yup.ref('password')], t('signup.passwordsDoNotMatch') || 'Passwords do not match'),
  });
};

export const createExpertStep1Schema = (t) => {
  return yup.object().shape({
    firstname: yup
      .string()
      .required(t(SIGNUP_VALIDATION.FIRSTNAME_REQUIRED) || 'First name is required'),
    lastname: yup
      .string()
      .required(t(SIGNUP_VALIDATION.LASTNAME_REQUIRED) || 'Last name is required'),
    email: yup
      .string()
      .required(t(SIGNUP_VALIDATION.EMAIL_REQUIRED) || 'Email is required')
      .email(t(SIGNUP_VALIDATION.EMAIL_INVALID) || 'Invalid email address'),
    phone: yup
      .string()
      .required(t(SIGNUP_VALIDATION.PHONE_REQUIRED) || 'Phone number is required'),
    linkedin: yup
      .string()
      .nullable()
      .test('url', t('signup.linkedinInvalid') || 'Please enter a valid URL', (value) => {
        if (!value || value.length === 0) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }),
  });
};

export const createExpertStep2Schema = (t) => {
  return yup.object().shape({
    sector: yup
      .string()
      .required(t(SIGNUP_VALIDATION.PROFESSION_REQUIRED) || 'Profession is required'),
    experience: yup
      .string()
      .required(t(SIGNUP_VALIDATION.EXPERIENCE_REQUIRED) || 'Experience is required'),
    dailyRate: yup
      .string()
      .required(t(SIGNUP_VALIDATION.DAILY_RATE_REQUIRED) || 'Daily rate is required'),
  });
};

export const createExpertStep3Schema = (t) => {
  return yup.object().shape({
    password: yup
      .string()
      .required(t(SIGNUP_VALIDATION.PASSWORD_REQUIRED) || 'Password is required')
      .min(8, t('signup.passwordMinLength') || 'Password must contain at least 8 characters')
      .matches(/[A-Z]/, t('signup.passwordUppercase') || 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, t('signup.passwordLowercase') || 'Password must contain at least one lowercase letter')
      .matches(/[^a-zA-Z0-9]/, t('signup.passwordSymbol') || 'Password must contain at least one symbol'),
    confirmPassword: yup
      .string()
      .required(t('signup.confirmPasswordRequired') || 'Please confirm your password')
      .oneOf([yup.ref('password')], t('signup.passwordsDoNotMatch') || 'Passwords do not match'),
  });
};

