import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';

countries.registerLocale(enLocale);
countries.registerLocale(frLocale);

export const getCountryOptions = (t) => {
  return [
    { value: 'France', label: t('signup.countries.france') || 'France' },
    { value: 'Belgique', label: t('signup.countries.belgium') || 'Belgium' },
    { value: 'Suisse', label: t('signup.countries.switzerland') || 'Switzerland' },
    { value: 'Luxembourg', label: t('signup.countries.luxembourg') || 'Luxembourg' },
    { value: 'Canada', label: t('signup.countries.canada') || 'Canada' },
    { value: 'Autre', label: t('signup.countries.other') || 'Other' },
  ];
};

export const getCountryName = (countryCode, locale = 'en') => {
  if (!countryCode) return '';
  
  const countryOptions = getCountryOptions(() => '');
  const foundOption = countryOptions.find(opt => opt.value === countryCode);
  if (foundOption) {
    return foundOption.label;
  }
  
  try {
    const name = countries.getName(countryCode, locale === 'en' ? 'en' : 'fr', { select: 'official' });
    return name || countryCode;
  } catch (error) {
    return countryCode;
  }
};

