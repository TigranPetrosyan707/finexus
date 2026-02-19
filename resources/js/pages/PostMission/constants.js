export const LOCATION_OPTIONS = [
  { value: 'remote', labelKey: 'postMission.locations.remote' },
  { value: 'onSite', labelKey: 'postMission.locations.onSite' }
];

export const SECTOR_OPTIONS = [
  { value: 'Commerce', labelKey: 'postMission.sectors.commerce' },
  { value: 'Industrie', labelKey: 'postMission.sectors.industrie' },
  { value: 'Services', labelKey: 'postMission.sectors.services' },
  { value: 'Finance', labelKey: 'postMission.sectors.finance' },
  { value: 'Autre', labelKey: 'postMission.sectors.autre' }
];

export const REQUIREMENT_OPTIONS = [
  { value: 'exp8', labelKey: 'postMission.requirements.exp8' },
  { value: 'exp5', labelKey: 'postMission.requirements.exp5' },
  { value: 'exp10', labelKey: 'postMission.requirements.exp10' },
  { value: 'smeExpertise', labelKey: 'postMission.requirements.smeExpertise' },
  { value: 'monthlyAvailability', labelKey: 'postMission.requirements.monthlyAvailability' },
  { value: 'excelBI', labelKey: 'postMission.requirements.excelBI' },
  { value: 'analyticalRigor', labelKey: 'postMission.requirements.analyticalRigor' },
  { value: 'fundraisingExp', labelKey: 'postMission.requirements.fundraisingExp' },
  { value: 'startupExp', labelKey: 'postMission.requirements.startupExp' }
];

export const POST_MISSION_VALIDATION = {
  TITLE_REQUIRED: 'postMission.titleRequired',
  DESCRIPTION_REQUIRED: 'postMission.descriptionRequired',
  BUDGET_REQUIRED: 'postMission.budgetRequired',
  BUDGET_MIN: 'postMission.budgetMin',
  DURATION_REQUIRED: 'postMission.durationRequired',
  DURATION_MIN: 'postMission.durationMin',
  LOCATION_REQUIRED: 'postMission.locationRequired',
  SECTION_REQUIRED: 'postMission.sectionRequired',
  OTHER_SECTION_REQUIRED: 'postMission.otherSectionRequired',
  START_DATE_REQUIRED: 'postMission.startDateRequired',
};

export const POST_MISSION_ERRORS = {
  CREATE_ERROR: 'postMission.createError',
  UPDATE_ERROR: 'postMission.updateError',
  DELETE_ERROR: 'postMission.deleteError',
  LOAD_ERROR: 'postMission.loadError',
};

