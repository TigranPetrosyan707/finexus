import * as yup from 'yup';
import { POST_MISSION_VALIDATION } from './constants';

export const createMissionSchema = (t) => {
  return yup.object().shape({
    title: yup
      .string()
      .required(t(POST_MISSION_VALIDATION.TITLE_REQUIRED) || 'Title is required'),
    description: yup
      .string()
      .required(t(POST_MISSION_VALIDATION.DESCRIPTION_REQUIRED) || 'Description is required'),
    minBudget: yup
      .number()
      .typeError(t(POST_MISSION_VALIDATION.BUDGET_REQUIRED) || 'Min budget must be a number')
      .required(t(POST_MISSION_VALIDATION.BUDGET_REQUIRED) || 'Min budget is required')
      .min(0, t(POST_MISSION_VALIDATION.BUDGET_MIN) || 'Min budget must be at least 0€'),
    maxBudget: yup
      .number()
      .typeError(t(POST_MISSION_VALIDATION.BUDGET_REQUIRED) || 'Max budget must be a number')
      .required(t(POST_MISSION_VALIDATION.BUDGET_REQUIRED) || 'Max budget is required')
      .min(yup.ref('minBudget'), t('postMission.budgetMaxMin') || 'Max budget must be greater than or equal to min budget'),
    durationDays: yup
      .number()
      .typeError(t(POST_MISSION_VALIDATION.DURATION_REQUIRED) || 'Duration must be a number')
      .required(t(POST_MISSION_VALIDATION.DURATION_REQUIRED) || 'Duration is required')
      .min(1, t(POST_MISSION_VALIDATION.DURATION_MIN) || 'Duration must be at least 1 day'),
    location: yup
      .string()
      .required(t(POST_MISSION_VALIDATION.LOCATION_REQUIRED) || 'Location is required'),
    section: yup
      .string()
      .required(t(POST_MISSION_VALIDATION.SECTION_REQUIRED) || 'Section is required'),
    otherSection: yup
      .string()
      .when('section', {
        is: 'Autre',
        then: (schema) => schema.required(t(POST_MISSION_VALIDATION.OTHER_SECTION_REQUIRED) || 'Please specify the section'),
        otherwise: (schema) => schema.notRequired(),
      }),
    startDate: yup
      .date()
      .nullable()
      .required(t(POST_MISSION_VALIDATION.START_DATE_REQUIRED) || 'Start date is required'),
    requirements: yup
      .array()
      .of(yup.string())
      .default([]),
    documents: yup
      .array()
      .of(yup.string())
      .default([]),
  });
};

