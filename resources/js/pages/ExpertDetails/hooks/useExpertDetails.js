import { useState, useEffect } from 'react';
import { expertsDB } from '../../SearchExperts/db';
import { formatExpertProfile } from '../../ExpertProfile/db/schema';
import { assignedMissionsDB } from '../../Missions/db';
import toast from 'react-hot-toast';

export const useExpertDetails = (expertId, t) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadExpert = async () => {
      try {
        setLoading(true);
        const expert = await expertsDB.getExpertById(expertId);
        
        if (!expert || expert.role !== 'expert') {
          setProfile(null);
          return;
        }

        const assignedMissions = await assignedMissionsDB.getAssignedMissionsByExpertId(expertId);
        const completedMissions = assignedMissions.filter(m => m.status === 'completed').length;
        
        const stats = {
          completedMissions,
        };

        const formattedProfile = formatExpertProfile(expert, stats);
        setProfile(formattedProfile);
      } catch (error) {
        console.error('Error loading expert details:', error);
        toast.error(t('expertDetails.loadError') || 'Failed to load expert profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (expertId) {
      loadExpert();
    }
  }, [expertId, t]);

  return { profile, loading };
};

