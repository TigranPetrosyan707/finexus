import { useState, useEffect, useCallback } from 'react';
import { assignedMissionsDB } from '../db';
import { hireRequestsDB } from '../../HireRequests/db';
import { enrichHireRequest, convertHireRequestToMissionFormat, convertApplicationRequestToMissionFormat } from '../../HireRequests/utils';
import { db } from '../../../utils/database';

export const useMissions = (userRole) => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [activeTab, setActiveTab] = useState('active');

  const loadMissions = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await db.get('currentUser');
      
      if (!currentUser) {
        setMissions([]);
        return;
      }

      let enrichedMissions = [];
      
      if (userRole === 'company') {
        enrichedMissions = await assignedMissionsDB.getEnrichedMissionsForCompany(currentUser.id);
        
        const hireRequests = await hireRequestsDB.getHireRequestsByCompanyId(currentUser.id);
        const enrichedHireRequests = await Promise.all(
          hireRequests.map(request => enrichHireRequest(request, userRole))
        );
        const hireRequestMissions = enrichedHireRequests
          .map(request => convertHireRequestToMissionFormat(request, userRole))
          .filter(Boolean);
        
        const applicationRequests = await hireRequestsDB.getApplicationRequestsByCompanyId(currentUser.id);
        const enrichedApplicationRequests = await Promise.all(
          applicationRequests.map(request => enrichHireRequest(request, userRole))
        );
        const applicationRequestMissions = enrichedApplicationRequests
          .map(request => convertApplicationRequestToMissionFormat(request, userRole))
          .filter(Boolean);
        
        enrichedMissions = [...enrichedMissions, ...hireRequestMissions, ...applicationRequestMissions];
      } else if (userRole === 'expert') {
        enrichedMissions = await assignedMissionsDB.getEnrichedMissionsForExpert(currentUser.id);
        
        const hireRequests = await hireRequestsDB.getHireRequestsByExpertId(currentUser.id);
        const enrichedHireRequests = await Promise.all(
          hireRequests.map(request => enrichHireRequest(request, userRole))
        );
        const hireRequestMissions = enrichedHireRequests
          .map(request => convertHireRequestToMissionFormat(request, userRole))
          .filter(Boolean);
        
        const applicationRequests = await hireRequestsDB.getApplicationRequestsByExpertId(currentUser.id);
        const enrichedApplicationRequests = await Promise.all(
          applicationRequests.map(request => enrichHireRequest(request, userRole))
        );
        const applicationRequestMissions = enrichedApplicationRequests
          .map(request => convertApplicationRequestToMissionFormat(request, userRole))
          .filter(Boolean);
        
        enrichedMissions = [...enrichedMissions, ...hireRequestMissions, ...applicationRequestMissions];
      }

      setMissions(enrichedMissions);
    } catch (error) {
      console.error('Error loading missions:', error);
      setMissions([]);
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const filteredMissions = missions.filter(m => {
    if (activeTab === 'all') return true;
    return m.status === activeTab;
  });

  return {
    loading,
    missions: filteredMissions,
    allMissions: missions,
    activeTab,
    setActiveTab,
    loadMissions,
  };
};

