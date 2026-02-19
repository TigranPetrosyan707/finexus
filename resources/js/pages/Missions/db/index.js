import { db } from '../../../utils/database';
import { userDB } from '../../../utils/database';
import { missionsDB } from '../../PostMission/db';
import { createAssignedMissionSchema } from './schema';

export const assignedMissionsDB = {
  async getAllAssignedMissions() {
    const assignedMissions = await db.get('assignedMissions') || [];
    return assignedMissions;
  },

  async getAssignedMissionsByCompanyId(companyId) {
    const assignedMissions = await db.get('assignedMissions') || [];
    return assignedMissions.filter(am => am.companyId === companyId);
  },

  async getAssignedMissionsByExpertId(expertId) {
    const assignedMissions = await db.get('assignedMissions') || [];
    return assignedMissions.filter(am => am.expertId === expertId);
  },

  async getAssignedMissionById(id) {
    const assignedMissions = await db.get('assignedMissions') || [];
    return assignedMissions.find(am => am.id === id);
  },

  async createAssignedMission(missionId, companyId, expertId, status = 'pending') {
    const assignedMissions = await db.get('assignedMissions') || [];
    const assignedMission = createAssignedMissionSchema(missionId, companyId, expertId, status);
    assignedMissions.push(assignedMission);
    await db.set('assignedMissions', assignedMissions);
    return assignedMission;
  },

  async updateAssignedMissionStatus(id, status, endDate = null) {
    const assignedMissions = await db.get('assignedMissions') || [];
    const index = assignedMissions.findIndex(am => am.id === id);
    if (index !== -1) {
      assignedMissions[index] = {
        ...assignedMissions[index],
        status: status,
        startDate: status === 'active' && !assignedMissions[index].startDate 
          ? new Date().toISOString().split('T')[0] 
          : assignedMissions[index].startDate,
        endDate: endDate || assignedMissions[index].endDate,
        updatedAt: new Date().toISOString(),
      };
      await db.set('assignedMissions', assignedMissions);
      return assignedMissions[index];
    }
    return null;
  },

  async getEnrichedMissionsForCompany(companyId) {
    const assignedMissions = await this.getAssignedMissionsByCompanyId(companyId);
    const allMissions = await missionsDB.getAllMissions();
    const allUsers = await userDB.getAllUsers();

    return assignedMissions.map(assignedMission => {
      const mission = allMissions.find(m => m.id === assignedMission.missionId);
      const expert = allUsers.find(u => u.id === assignedMission.expertId);

      return {
        ...assignedMission,
        mission: mission || null,
        expert: expert ? {
          id: expert.id,
          name: expert.personalInfo?.firstname && expert.personalInfo?.lastname
            ? `${expert.personalInfo.firstname} ${expert.personalInfo.lastname}`
            : expert.email,
          email: expert.email,
        } : null,
      };
    });
  },

  async getEnrichedMissionsForExpert(expertId) {
    const assignedMissions = await this.getAssignedMissionsByExpertId(expertId);
    const allMissions = await missionsDB.getAllMissions();
    const allUsers = await userDB.getAllUsers();

    return assignedMissions.map(assignedMission => {
      const mission = allMissions.find(m => m.id === assignedMission.missionId);
      const company = allUsers.find(u => u.id === assignedMission.companyId);

      return {
        ...assignedMission,
        mission: mission || null,
        company: company ? {
          id: company.id,
          name: company.companyInfo?.name || company.email,
          email: company.email,
        } : null,
      };
    });
  },
};

