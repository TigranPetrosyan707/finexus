import { LOCATION_OPTIONS, REQUIREMENT_OPTIONS, SECTOR_OPTIONS } from './constants';

export const getLocationOptions = (t) => {
  return LOCATION_OPTIONS.map(option => ({
    value: option.value,
    label: t(option.labelKey)
  }));
};

export const getSectorOptions = (t) => {
  return SECTOR_OPTIONS.map(option => ({
    value: option.value,
    label: t(option.labelKey)
  }));
};

export const getRequirementOptions = (t) => {
  return REQUIREMENT_OPTIONS.map(option => ({
    value: option.value,
    label: t(option.labelKey)
  }));
};

export const formatMissionDate = (dateString, locale = 'en') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export { getDocuments, getDocumentOptions } from './utils/documents';

