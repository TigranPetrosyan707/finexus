import { useState, useEffect, useCallback } from 'react';
import { hireRequestsDB } from '../db';
import { missionsDB } from '../../PostMission/db';
import { db } from '../../../utils/database';
import toast from 'react-hot-toast';

export const useHireRequest = (expertId) => {
  const [hireRequest, setHireRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [companyMissions, setCompanyMissions] = useState([]);
  const [missionStatuses, setMissionStatuses] = useState({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await db.get('currentUser');
      setCurrentUser(user);

      if (user && user.role === 'company' && expertId) {
        const request = await hireRequestsDB.getHireRequestByCompanyAndExpert(
          user.id,
          expertId
        );
        setHireRequest(request);

        const missions = await missionsDB.getMissionsByCompanyId(user.id);
        const activeMissions = missions.filter(m => m.status === 'active');
        
        const statusMap = {};
        for (const mission of activeMissions) {
          const missionRequest = await hireRequestsDB.getHireRequestByCompanyExpertAndMission(
            user.id,
            expertId,
            mission.id
          );
          if (missionRequest) {
            statusMap[mission.id] = missionRequest.status;
          }
        }
        setMissionStatuses(statusMap);
        
        setCompanyMissions(activeMissions);
      }
    } catch (error) {
      console.error('Error loading hire request:', error);
    } finally {
      setLoading(false);
    }
  }, [expertId]);

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

    const existingRequest = await hireRequestsDB.getHireRequestByCompanyExpertAndMission(
      currentUser.id,
      expertId,
      missionId
    );

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        toast.error('Hire request already pending for this mission');
        return false;
      }
      if (existingRequest.status === 'accepted') {
        toast.error('Hire request already accepted for this mission');
        return false;
      }
    }

    try {
      setIsSending(true);
      await hireRequestsDB.createHireRequest(
        currentUser.id,
        expertId,
        missionId
      );
      
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

