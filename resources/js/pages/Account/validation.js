import * as yup from 'yup';

export const createPasswordChangeSchema = (t) => {
  return yup.object().shape({
    oldPassword: yup
      .string()
      .required(t('changePassword.oldPasswordRequired') || 'Current password is required'),
    newPassword: yup
      .string()
      .required(t('changePassword.newPasswordRequired') || 'New password is required')
      .min(8, t('changePassword.minLength') || 'Password must be at least 8 characters')
      .matches(/[A-Z]/, t('changePassword.uppercase') || 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, t('changePassword.number') || 'Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/, t('changePassword.special') || 'Password must contain at least one special character'),
    confirmPassword: yup
      .string()
      .required(t('changePassword.confirmPasswordRequired') || 'Please confirm your password')
      .oneOf([yup.ref('newPassword')], t('changePassword.passwordMismatch') || 'Passwords do not match'),
  });
};

export const createCompanyInfoSchema = (t) => {
  return yup.object().shape({
    name: yup
      .string()
      .required(t('account.companyNameRequired') || 'Company name is required'),
    sector: yup
      .string()
      .required(t('account.sectorRequired') || 'Sector is required'),
    otherSector: yup
      .string()
      .when('sector', {
        is: (sector) => sector === 'Autre' || sector === 'Other',
        then: (schema) => schema.required(t('signup.specifySector') || 'Please specify the sector'),
        otherwise: (schema) => schema,
      }),
    country: yup
      .string()
      .required(t('account.countryRequired') || 'Country is required'),
    otherCountry: yup
      .string()
      .when('country', {
        is: 'OTHER',
        then: (schema) => schema.required(t('signup.otherCountryRequired') || 'Please specify the country'),
        otherwise: (schema) => schema,
      }),
    siret: yup
      .string()
      .when('country', {
        is: (val) => val && val !== 'OTHER',
        then: (schema) => schema.required(t('account.siretRequired') || 'Registration number is required'),
        otherwise: (schema) => schema,
      }),
  });
};

export const createUserInfoSchema = (t) => {
  return yup.object().shape({
    firstname: yup
      .string()
      .required(t('account.firstnameRequired') || 'First name is required'),
    lastname: yup
      .string()
      .required(t('account.lastnameRequired') || 'Last name is required'),
    email: yup
      .string()
      .email(t('account.emailInvalid') || 'Invalid email address')
      .required(t('account.emailRequired') || 'Email is required'),
    phone: yup
      .string()
      .required(t('account.phoneRequired') || 'Phone is required'),
    role: yup.string(),
  });
};
