import { db } from '../../../utils/database';
import { createMissionSchema } from './schema';

export const missionsDB = {
  async getAllMissions() {
    const missions = await db.get('missions') || [];
    return missions;
  },

  async getMissionsByCompanyId(companyId) {
    const missions = await db.get('missions') || [];
    return missions.filter(mission => mission.companyId === companyId);
  },

  async getMissionById(id) {
    const missions = await db.get('missions') || [];
    return missions.find(mission => mission.id === id);
  },

  async createMission(formData, companyId) {
    const missions = await db.get('missions') || [];
    const missionData = createMissionSchema(formData, companyId);
    missions.push(missionData);
    await db.set('missions', missions);
    return missionData;
  },

  async updateMission(id, formData) {
    const missions = await db.get('missions') || [];
    const index = missions.findIndex(mission => mission.id === id);
    if (index !== -1) {
      const existingMission = missions[index];
      missions[index] = {
        ...existingMission,
        ...createMissionSchema(formData, existingMission.companyId),
        id: existingMission.id,
        postedDate: existingMission.postedDate,
        applications: existingMission.applications,
        createdAt: existingMission.createdAt,
      };
      await db.set('missions', missions);
      return missions[index];
    }
    return null;
  },

  async deleteMission(id) {
    const missions = await db.get('missions') || [];
    const filtered = missions.filter(mission => mission.id !== id);
    await db.set('missions', filtered);
    return true;
  },
};

