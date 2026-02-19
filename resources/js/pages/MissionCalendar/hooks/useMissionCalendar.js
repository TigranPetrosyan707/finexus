import { useState, useEffect } from 'react';
import { assignedMissionsDB } from '../../Missions/db';
import { db } from '../../../utils/database';

export const useMissionCalendar = () => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);

  useEffect(() => {
    const loadMissions = async () => {
      try {
        setLoading(true);
        const currentUser = await db.get('currentUser');
        
        if (!currentUser || currentUser.role !== 'expert') {
          setMissions([]);
          return;
        }

        const enrichedMissions = await assignedMissionsDB.getEnrichedMissionsForExpert(currentUser.id);
        
        const activeMissions = enrichedMissions.filter(m => 
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

