import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { formatExpertProfile } from '../../ExpertProfile/db/schema';
import toast from 'react-hot-toast';

export const useExpertDetails = (expertId, t) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadExpert = async () => {
      if (!expertId) return;
      try {
        setLoading(true);
        const { expert, assignedMissions } = await api.get(`/api/experts/${expertId}`);
        if (!expert) {
          setProfile(null);
          return;
        }
        const completed = (assignedMissions || []).filter(m => m.status === 'completed').length;
        const stats = { completedMissions: completed };
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

    loadExpert();
  }, [expertId, t]);

  return { profile, loading };
};

