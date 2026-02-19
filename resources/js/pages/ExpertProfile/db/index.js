import { db } from '../../../utils/database';
import { assignedMissionsDB } from '../../Missions/db';

export const expertProfileDB = {
  async getCurrentExpert() {
    const currentUser = await db.get('currentUser');
    if (!currentUser || currentUser.role !== 'expert') {
      return null;
    }
    return currentUser;
  },

  async getExpertStats(expertId) {
    const assignedMissions = await assignedMissionsDB.getAssignedMissionsByExpertId(expertId);
    const completedMissions = assignedMissions.filter(am => am.status === 'completed').length;
    
    return {
      completedMissions,
    };
  },

  async updateExpertProfile(expertId, formData) {
    const users = await db.get('users') || [];
    const index = users.findIndex(u => u.id === expertId);
    
    if (index === -1) {
      return null;
    }

    const existingUser = users[index];
    users[index] = {
      ...existingUser,
      personalInfo: {
        ...existingUser.personalInfo,
        firstname: formData.firstname || existingUser.personalInfo?.firstname || '',
        lastname: formData.lastname || existingUser.personalInfo?.lastname || '',
        email: formData.email || existingUser.personalInfo?.email || existingUser.email,
        phone: formData.phone || existingUser.personalInfo?.phone || '',
        linkedin: formData.linkedin || existingUser.personalInfo?.linkedin || null,
      },
      professionalInfo: {
        ...existingUser.professionalInfo,
        profession: formData.profession || existingUser.professionalInfo?.profession || '',
        experience: formData.experience || existingUser.professionalInfo?.experience || '',
        dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : existingUser.professionalInfo?.dailyRate || null,
      },
      specialties: formData.specialties || existingUser.specialties || [],
      description: formData.description || existingUser.description || '',
      updatedAt: new Date().toISOString(),
    };

    await db.set('users', users);
    
    const currentUser = await db.get('currentUser');
    if (currentUser && currentUser.id === expertId) {
      await db.set('currentUser', users[index]);
    }

    return users[index];
  },
};

