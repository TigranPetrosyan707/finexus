import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';
import toast from 'react-hot-toast';

export const useHireRequest = (expertId) => {
  const { user: currentUser } = useAuth();
  const [hireRequest, setHireRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [companyMissions, setCompanyMissions] = useState([]);
  const [missionStatuses, setMissionStatuses] = useState({});

  const loadData = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'company' || !expertId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [missionsRes, hireRes] = await Promise.all([
        api.get('/api/missions'),
        api.get('/api/hire-requests?type=hire'),
      ]);
      const missions = (missionsRes.missions || []).filter(m => m.status === 'active');
      setCompanyMissions(missions);
      const hireList = (hireRes.data || []).filter(r => r.expertId === Number(expertId));
      setHireRequest(hireList[0] || null);
      const statusMap = {};
      hireList.forEach(r => { if (r.missionId) statusMap[r.missionId] = r.status; });
      setMissionStatuses(statusMap);
    } catch (error) {
      console.error('Error loading hire request:', error);
    } finally {
      setLoading(false);
    }
  }, [expertId, currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sendHireRequest = async (missionId) => {
    if (!currentUser || currentUser.role !== 'company') {
      toast.error('Only companies can send hire requests');
      return false;
    }

    if (!expertId) {
      toast.error('Expert ID is required');
      return false;
    }

    if (!missionId) {
      toast.error('Please select a mission');
      return false;
    }

    const existing = missionStatuses[missionId];
    if (existing === 'pending') {
      toast.error('Hire request already pending for this mission');
      return false;
    }
    if (existing === 'accepted') {
      toast.error('Hire request already accepted for this mission');
      return false;
    }
    try {
      setIsSending(true);
      await api.post('/api/hire-requests', { type: 'hire', expertId: Number(expertId), missionId });
      
      await loadData();
      
      toast.success('Hire request sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending hire request:', error);
      toast.error('Failed to send hire request');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    hireRequest,
    loading,
    isSending,
    currentUser,
    sendHireRequest,
    hasPendingRequest: Object.values(missionStatuses).includes('pending'),
    hasAcceptedRequest: Object.values(missionStatuses).includes('accepted'),
    hasRejectedRequest: Object.values(missionStatuses).includes('rejected'),
    hasRequest: Object.keys(missionStatuses).length > 0,
    companyMissions,
    missionStatuses,
    reloadData: loadData,
  };
};

