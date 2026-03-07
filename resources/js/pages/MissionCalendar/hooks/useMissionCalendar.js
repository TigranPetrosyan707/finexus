import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

export const useMissionCalendar = () => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);

  useEffect(() => {
    const loadMissions = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/assigned-missions');
        const list = data || [];
        const activeMissions = list.filter(m =>
          m.status === 'active' || m.status === 'pending'
        );
        setMissions(activeMissions);
        if (activeMissions.length > 0) {
          setSelectedMission(prev => prev || activeMissions[0]);
        }
      } catch (error) {
        console.error('Error loading missions:', error);
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadMissions();
  }, []);

  return {
    missions,
    loading,
    selectedMission,
    setSelectedMission,
  };
};

