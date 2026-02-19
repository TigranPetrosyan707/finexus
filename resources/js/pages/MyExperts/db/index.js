import { userDB } from '../../../utils/database';
import { assignedMissionsDB } from '../../Missions/db';
import { missionsDB } from '../../PostMission/db';

export const myExpertsDB = {
  async getExpertsForCompany(companyId) {
    const assignedMissions = await assignedMissionsDB.getAssignedMissionsByCompanyId(companyId);
    const allUsers = await userDB.getAllUsers();
    const allMissions = await missionsDB.getAllMissions();

    const expertMap = new Map();

    assignedMissions.forEach(assignedMission => {
      const expertId = assignedMission.expertId;
      const expert = allUsers.find(u => u.id === expertId && u.role === 'expert');
      
      if (!expert) return;

      if (!expertMap.has(expertId)) {
        const personalInfo = expert.personalInfo || {};
        const professionalInfo = expert.professionalInfo || {};
        
        expertMap.set(expertId, {
          id: expert.id,
          name: `${personalInfo.firstname || ''} ${personalInfo.lastname || ''}`.trim() || expert.email,
          firstname: personalInfo.firstname || '',
          lastname: personalInfo.lastname || '',
          email: personalInfo.email || expert.email || '',
          phone: personalInfo.phone || '',
          profession: professionalInfo.profession || '',
          experienceYears: parseInt(professionalInfo.experience) || 0,
          rate: professionalInfo.dailyRate || 0,
          rating: expert.rating || 0,
          reviews: expert.reviews || 0,
          verified: expert.verified || false,
          specialties: expert.specialties || [],
          missions: [],
        });
      }

      const expertData = expertMap.get(expertId);
      const mission = allMissions.find(m => m.id === assignedMission.missionId);
      
      if (mission) {
        expertData.missions.push({
          ...assignedMission,
          mission: mission,
        });
      }
    });

    return Array.from(expertMap.values()).map(expert => {
      const missions = expert.missions.sort((a, b) => {
        const dateA = a.startDate || a.createdAt;
        const dateB = b.startDate || b.createdAt;
        return new Date(dateB) - new Date(dateA);
      });

      const lastMission = missions[0];
      
      return {
        ...expert,
        missionsCount: missions.length,
        lastMissionDate: lastMission?.startDate || lastMission?.createdAt?.split('T')[0] || null,
        lastMission: lastMission?.mission || null,
      };
    });
  },
};

