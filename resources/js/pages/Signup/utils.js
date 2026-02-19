import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';
import { roleOptions } from '../../constants/formOptions';

countries.registerLocale(enLocale);
countries.registerLocale(frLocale);

export const getTranslatedOptions = (options, i18n) => {
  return options.map(option => {
    if (option === 'Autre') {
      return i18n.language === 'en' ? 'Other' : 'Autre';
    }
    return option;
  });
};

export const getTranslatedRoleOptions = (t, i18n) => {
  const roleTranslations = {
    'Dirigeant': t('signup.roles.manager'),
    'DAF': t('signup.roles.daf'),
    'Comptable': t('signup.roles.accountant'),
    'Contrôleur de gestion': t('signup.roles.controller'),
    'Autre': i18n.language === 'en' ? 'Other' : 'Autre',
  };
  
  return roleOptions.map(option => ({
    value: option,
    label: roleTranslations[option] || option
  }));
};

export const getAllCountries = (i18n) => {
  const countryList = countries.getNames(i18n.language === 'en' ? 'en' : 'fr', { select: 'official' });
  const countryArray = Object.entries(countryList).map(([code, name]) => ({
    value: code,
    label: name
  }));
  countryArray.sort((a, b) => a.label.localeCompare(b.label));
  countryArray.push({ value: 'OTHER', label: i18n.language === 'en' ? 'Other' : 'Autre' });
  return countryArray;
};

export const getRegistrationNumberLabel = (countryCode, t) => {
  if (!countryCode || countryCode === 'OTHER') {
    return t('signup.registrationNumber');
  }
  
  const countryLabels = {
    'FRANCE': t('signup.siret'),
    'BELGIUM': t('signup.vatNumber'),
    'SWITZERLAND': t('signup.uidNumber'),
    'GERMANY': t('signup.registrationNumber'),
    'ENGLAND': t('signup.registrationNumber'),
  };
  
  return countryLabels[countryCode] || t('signup.registrationNumber');
};

export const getRegistrationNumberHelp = (countryCode, t) => {
  if (!countryCode || countryCode === 'OTHER') {
    return t('signup.registrationNumberHelp');
  }
  
  const countryHelps = {
    'FRANCE': t('signup.siretHelp'),
    'BELGIUM': t('signup.vatNumberHelp'),
    'SWITZERLAND': t('signup.uidNumberHelp'),
    'GERMANY': t('signup.registrationNumberHelp'),
    'ENGLAND': t('signup.registrationNumberHelp'),
  };
  
  return countryHelps[countryCode] || t('signup.registrationNumberHelp');
};

