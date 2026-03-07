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

const getRoleTranslationMap = (t, i18n) => ({
  'Dirigeant': t('signup.roles.manager'),
  'DAF': t('signup.roles.daf'),
  'Comptable': t('signup.roles.accountant'),
  'Contrôleur de gestion': t('signup.roles.controller'),
  'Autre': i18n.language === 'en' ? 'Other' : 'Autre',
});

export const getTranslatedRoleOptions = (t, i18n) => {
  const roleTranslations = getRoleTranslationMap(t, i18n);
  return roleOptions.map(option => ({
    value: option,
    label: roleTranslations[option] || option
  }));
};

/** Returns the display label for a role value (e.g. 'Dirigeant' -> 'Manager'). Use otherRole when value is Autre/Other. */
export const getRoleDisplayLabel = (roleValue, t, i18n) => {
  if (!roleValue) return '';
  if (roleValue === 'Autre' || roleValue === 'Other') return ''; // caller should use otherRole instead
  const map = getRoleTranslationMap(t, i18n);
  return map[roleValue] || roleValue;
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

