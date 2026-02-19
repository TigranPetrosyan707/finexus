export const ASSIGNED_MISSION_SCHEMA = {
  id: '',
  missionId: '',
  companyId: '',
  expertId: '',
  status: 'pending',
  startDate: '',
  endDate: null,
  createdAt: '',
  updatedAt: '',
};

export const createAssignedMissionSchema = (missionId, companyId, expertId, status = 'pending') => {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    missionId: missionId,
    companyId: companyId,
    expertId: expertId,
    status: status,
    startDate: status === 'active' ? new Date().toISOString().split('T')[0] : '',
    endDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

