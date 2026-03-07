import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';
import toast from 'react-hot-toast';

export const useApplicationRequest = (missionId) => {
  const { user: currentUser } = useAuth();
  const [applicationRequest, setApplicationRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const loadData = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'expert' || !missionId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: list } = await api.get('/api/hire-requests?type=application');
      const request = (list || []).find(r => r.missionId === Number(missionId)) || null;
      setApplicationRequest(request);
    } catch (error) {
      console.error('Error loading application request:', error);
    } finally {
      setLoading(false);
    }
  }, [missionId, currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sendApplicationRequest = async (mid) => {
    if (!currentUser || currentUser.role !== 'expert') {
      toast.error('Only experts can send application requests');
      return false;
    }
    if (!mid) {
      toast.error('Mission ID is required');
      return false;
    }
    if (applicationRequest?.status === 'pending') {
      toast.error('Application already pending for this mission');
      return false;
    }
    if (applicationRequest?.status === 'accepted') {
      toast.error('Application already accepted for this mission');
      return false;
    }
    try {
      setIsSending(true);
      await api.post('/api/hire-requests', { type: 'application', missionId: Number(mid) });
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
    hasPendingApplication: applicationRequest?.status === 'pending',
    hasAcceptedApplication: applicationRequest?.status === 'accepted',
    hasRejectedApplication: applicationRequest?.status === 'rejected',
    hasApplication: !!applicationRequest,
    reloadData: loadData,
  };
};

