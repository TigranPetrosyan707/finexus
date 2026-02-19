import { useState, useEffect, useCallback } from 'react';
import { hireRequestsDB } from '../db';
import { availableMissionsDB } from '../../AvailableMissions/db';
import { db } from '../../../utils/database';
import toast from 'react-hot-toast';

export const useApplicationRequest = (missionId) => {
  const [applicationRequest, setApplicationRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await db.get('currentUser');
      setCurrentUser(user);

      if (user && user.role === 'expert' && missionId) {
        const request = await hireRequestsDB.getApplicationRequestByExpertAndMission(
          user.id,
          missionId
        );
        setApplicationRequest(request);
      }
    } catch (error) {
      console.error('Error loading application request:', error);
    } finally {
      setLoading(false);
    }
  }, [missionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sendApplicationRequest = async (missionId) => {
    if (!currentUser || currentUser.role !== 'expert') {
      toast.error('Only experts can send application requests');
      return false;
    }

    if (!missionId) {
      toast.error('Mission ID is required');
      return false;
    }

    const existingRequest = await hireRequestsDB.getApplicationRequestByExpertAndMission(
      currentUser.id,
      missionId
    );

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        toast.error('Application already pending for this mission');
        return false;
      }
      if (existingRequest.status === 'accepted') {
        toast.error('Application already accepted for this mission');
        return false;
      }
    }

    try {
      const mission = await availableMissionsDB.getMissionById(missionId);
      if (!mission) {
        toast.error('Mission not found');
        return false;
      }

      setIsSending(true);
      await hireRequestsDB.createApplicationRequest(
        currentUser.id,
        mission.companyId,
        missionId
      );
      
      await loadData();
      
      toast.success('Application sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending application request:', error);
      toast.error('Failed to send application');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    applicationRequest,
    loading,
    isSending,
    currentUser,
    sendApplicationRequest,
    hasPendingApplication: applicationRequest && applicationRequest.status === 'pending',
    hasAcceptedApplication: applicationRequest && applicationRequest.status === 'accepted',
    hasRejectedApplication: applicationRequest && applicationRequest.status === 'rejected',
    hasApplication: !!applicationRequest,
    reloadData: loadData,
  };
};

