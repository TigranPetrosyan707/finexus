import { missionsDB } from '../../PostMission/db';
import { userDB } from '../../../utils/database';

export const availableMissionsDB = {
  async getAllAvailableMissions() {
    const missions = await missionsDB.getAllMissions();
    const allUsers = await userDB.getAllUsers();
    
    return missions
      .filter(mission => mission.status === 'active')
      .map(mission => {
        const company = allUsers.find(u => u.id === mission.companyId);
        
        return {
          ...mission,
          company: company ? {
            id: company.id,
            name: company.companyInfo?.name || company.email,
            email: company.email,
          } : null,
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.postedDate || a.createdAt);
        const dateB = new Date(b.postedDate || b.createdAt);
        return dateB - dateA;
      });
  },

  async getMissionById(id) {
    const missions = await missionsDB.getAllMissions();
    const allUsers = await userDB.getAllUsers();
    
    const mission = missions.find(m => m.id === id);
    if (!mission) return null;

    const company = allUsers.find(u => u.id === mission.companyId);
    
    return {
      ...mission,
      company: company ? {
        id: company.id,
        name: company.companyInfo?.name || company.email,
        email: company.email,
      } : null,
    };
  },
};

