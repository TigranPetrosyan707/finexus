import * as yup from 'yup';

export const createExpertProfileSchema = (t) => {
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
    linkedin: yup
      .string()
      .nullable()
      .transform((value) => (value === '' || !value ? null : value))
      .test('url', t('expertProfile.linkedinInvalid') || 'Invalid LinkedIn URL', (value) => {
        if (!value) return true;
        try {
          const url = value.startsWith('http://') || value.startsWith('https://') 
            ? value 
            : `https://${value}`;
          new URL(url);
          return true;
        } catch {
          return false;
        }
      }),
    profession: yup
      .string()
      .required(t('signup.expert.professionRequired') || 'Profession is required'),
    experience: yup
      .string()
      .required(t('signup.expert.experienceRequired') || 'Experience is required'),
    dailyRate: yup
      .number()
      .positive(t('signup.expert.dailyRateInvalid') || 'Daily rate must be positive')
      .required(t('signup.expert.dailyRateRequired') || 'Daily rate is required'),
    description: yup
      .string()
      .nullable(),
    specialties: yup
      .array()
      .of(yup.string())
      .nullable(),
  });
};

