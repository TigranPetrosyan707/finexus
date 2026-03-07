import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../utils/api';
import { convertHireRequestToMissionFormat, convertApplicationRequestToMissionFormat } from '../../HireRequests/utils';

function assignedToCard(a) {
  return {
    id: a.id,
    missionId: a.missionId,
    companyId: a.companyId ?? a.mission?.companyId ?? null,
    expertId: a.expertId ?? a.expert?.id ?? null,
    status: a.status,
    startDate: a.startDate || '',
    endDate: a.endDate || null,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    isHireRequest: false,
    isApplicationRequest: false,
    mission: a.mission || null,
    company: a.company || null,
    expert: a.expert || null,
  };
}

export const useMissions = (userRole) => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [activeTab, setActiveTab] = useState('active');

  const loadMissions = useCallback(async () => {
    try {
      setLoading(true);
      const [assignedRes, hireRes, applicationRes] = await Promise.all([
        api.get('/api/assigned-missions'),
        api.get('/api/hire-requests?type=hire'),
        api.get('/api/hire-requests?type=application'),
      ]);
      const assigned = (assignedRes.data || []).map(assignedToCard);
      const hireCards = (hireRes.data || [])
        .map((r) => convertHireRequestToMissionFormat({ ...r, updatedAt: r.updatedAt }, userRole))
        .filter(Boolean);
      const applicationCards = (applicationRes.data || [])
        .map((r) => convertApplicationRequestToMissionFormat({ ...r, updatedAt: r.updatedAt }, userRole))
        .filter(Boolean);
      setMissions([...assigned, ...hireCards, ...applicationCards]);
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

