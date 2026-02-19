export const HIRE_REQUEST_SCHEMA = {
  id: '',
  companyId: '',
  expertId: '',
  missionId: '',
  status: 'pending',
  type: 'hire',
  initiatedBy: 'company',
  respondedBy: null,
  createdAt: '',
  updatedAt: '',
};

export const createHireRequestSchema = (companyId, expertId, missionId) => {
  return {
    id: `hire-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    companyId: companyId,
    expertId: expertId,
    missionId: missionId || '',
    status: 'pending',
    type: 'hire',
    initiatedBy: 'company',
    respondedBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const APPLICATION_REQUEST_SCHEMA = {
  id: '',
  companyId: '',
  expertId: '',
  missionId: '',
  status: 'pending',
  type: 'application',
  initiatedBy: 'expert',
  respondedBy: null,
  createdAt: '',
  updatedAt: '',
};

export const createApplicationRequestSchema = (expertId, companyId, missionId) => {
  return {
    id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    expertId: expertId,
    companyId: companyId,
    missionId: missionId,
    status: 'pending',
    type: 'application',
    initiatedBy: 'expert',
    respondedBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

