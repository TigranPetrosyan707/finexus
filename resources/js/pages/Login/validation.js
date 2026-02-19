import * as yup from 'yup';
import { LOGIN_VALIDATION } from './constants';

export const createLoginSchema = (t) => {
  return yup.object().shape({
    email: yup
      .string()
      .required(t(LOGIN_VALIDATION.EMAIL_REQUIRED) || 'Email is required')
      .email(t(LOGIN_VALIDATION.EMAIL_INVALID) || 'Invalid email address'),
    password: yup
      .string()
      .required(t(LOGIN_VALIDATION.PASSWORD_REQUIRED) || 'Password is required')
      .min(6, t(LOGIN_VALIDATION.PASSWORD_MIN_LENGTH) || 'Password must be at least 6 characters'),
  });
};

