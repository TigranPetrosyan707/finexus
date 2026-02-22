import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { FaClock, FaEuroSign, FaCheckCircle, FaUser, FaBuilding, FaEye, FaTimes, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';
import RejectModal from './RejectModal';
import RejectionReasonModal from './RejectionReasonModal';
import ApplicationRejectModal from './ApplicationRejectModal';
import { hireRequestsDB } from '../../HireRequests/db';
import { db } from '../../../utils/database';
import toast from 'react-hot-toast';

const MissionCard = ({ assignedMission, userRole, t, i18n, onStatusChange }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRejectionReasonModal, setShowRejectionReasonModal] = useState(false);
  const [showApplicationRejectModal, setShowApplicationRejectModal] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const isHireRequest = assignedMission.isHireRequest;
  const isApplicationRequest = assignedMission.isApplicationRequest;
  
  if (!assignedMission.mission && !isHireRequest && !isApplicationRequest) {
    return null;
  }

  const { mission, expert, company } = assignedMission;

  const handleViewMission = () => {
    if (assignedMission.missionId) {
      router.visit(`/missions/view/${assignedMission.missionId}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <FaClock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <FaClock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <FaTimes className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleReject = async (rejectionReason) => {
    if (!assignedMission.hireRequest?.id) {
      toast.error(t('missions.rejectError') || 'Unable to reject request');
      return;
    }

    try {
      setIsRejecting(true);
      const currentUser = await db.get('currentUser');
      if (!currentUser) {
        toast.error(t('missions.rejectError') || 'User not found');
        return;
      }

      await hireRequestsDB.rejectHireRequest(
        assignedMission.hireRequest.id,
        currentUser.id,
        rejectionReason || null
      );

      toast.success(t('missions.rejectSuccess') || 'Request rejected successfully');
      setShowRejectModal(false);
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error(t('missions.rejectError') || 'Failed to reject request');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleAcceptApplication = async () => {
    if (!assignedMission.applicationRequest?.id) {
      toast.error(t('missions.acceptApplicationError') || 'Unable to accept application');
      return;
    }

    try {
      setIsRejecting(true);
      const currentUser = await db.get('currentUser');
      if (!currentUser) {
        toast.error(t('missions.acceptApplicationError') || 'User not found');
        return;
      }

      await hireRequestsDB.acceptApplicationRequest(
        assignedMission.applicationRequest.id,
        currentUser.id
      );

      toast.success(t('missions.acceptApplicationSuccess') || 'Application accepted successfully');
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error accepting application:', error);
      toast.error(t('missions.acceptApplicationError') || 'Failed to accept application');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleRejectApplication = async (rejectionReason) => {
    if (!assignedMission.applicationRequest?.id) {
      toast.error(t('missions.rejectApplicationError') || 'Unable to reject application');
      return;
    }

    try {
      setIsRejecting(true);
      const currentUser = await db.get('currentUser');
      if (!currentUser) {
        toast.error(t('missions.rejectApplicationError') || 'User not found');
        return;
      }

      await hireRequestsDB.rejectApplicationRequest(
        assignedMission.applicationRequest.id,
        currentUser.id,
        rejectionReason || null
      );

      toast.success(t('missions.rejectApplicationSuccess') || 'Application rejected successfully');
      setShowApplicationRejectModal(false);
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error(t('missions.rejectApplicationError') || 'Failed to reject application');
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusText = (status) => {
    return t(`missions.status.${status}`);
  };

  if (isHireRequest || isApplicationRequest) {
    const otherParty = userRole === 'expert' 
      ? (isHireRequest ? company : company)
      : (isHireRequest ? expert : expert);
    const canRespond = userRole === 'expert' && assignedMission.status === 'pending' && isHireRequest;
    
    const requestTitle = isHireRequest
      ? (userRole === 'expert' 
          ? t('missions.requestFromCompany', { companyName: otherParty?.name || t('missions.unknown') }) || `Request from ${otherParty?.name || t('missions.unknown')}`
          : t('missions.hireRequestTo', { expertName: otherParty?.name || t('missions.unknown') }) || `Hire Request to ${otherParty?.name || t('missions.unknown')}`)
      : (userRole === 'expert'
          ? (assignedMission.mission 
              ? t('missions.applicationForMission', { missionTitle: assignedMission.mission.title, companyName: otherParty?.name || t('missions.unknown') }) || `Job Application for ${assignedMission.mission.title} at ${otherParty?.name || t('missions.unknown')}`
              : t('missions.applicationTo', { companyName: otherParty?.name || t('missions.unknown') }) || `Job Application to ${otherParty?.name || t('missions.unknown')}`)
          : (assignedMission.mission
              ? t('missions.applicationFromForMission', { expertName: otherParty?.name || t('missions.unknown'), missionTitle: assignedMission.mission.title }) || `Job Application from ${otherParty?.name || t('missions.unknown')} for ${assignedMission.mission.title}`
              : t('missions.applicationFrom', { expertName: otherParty?.name || t('missions.unknown') }) || `Job Application from ${otherParty?.name || t('missions.unknown')}`));
    
    return (
      <>
      <div className="p-6 rounded-lg border-2 border-gray-200 hover:shadow-lg transition-all">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {getStatusIcon(assignedMission.status)}
                <h3 className="text-lg font-semibold text-gray-900">
                  {requestTitle}
                </h3>
                <span 
                  className="px-3 py-1 text-xs rounded-full" 
                  style={{ backgroundColor: `${colors.linkHover}15`, color: colors.linkHover }}
                >
                  {getStatusText(assignedMission.status)}
                </span>
                {((userRole === 'company' && assignedMission.status === 'rejected' && isHireRequest) ||
                  (userRole === 'expert' && assignedMission.status === 'rejected' && isApplicationRequest)) && (
                  <button
                    onClick={() => setShowRejectionReasonModal(true)}
                    disabled={!(assignedMission.hireRequest?.rejectionReason || assignedMission.applicationRequest?.rejectionReason)}
                    className={`p-2 rounded-lg transition-colors ${
                      (assignedMission.hireRequest?.rejectionReason || assignedMission.applicationRequest?.rejectionReason)
                        ? 'text-red-500 hover:bg-red-50 cursor-pointer'
                        : 'text-gray-300 cursor-not-allowed opacity-50'
                    }`}
                    title={(assignedMission.hireRequest?.rejectionReason || assignedMission.applicationRequest?.rejectionReason)
                      ? t('missions.viewRejectionReason') || 'View rejection reason'
                      : t('missions.noRejectionReason') || 'No rejection reason provided'}
                  >
                    <FaInfoCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {(userRole === 'expert' && canRespond) || (userRole === 'company' && assignedMission.status === 'pending' && isApplicationRequest) ? (
              <div className="flex gap-2 flex-shrink-0">
                {userRole === 'expert' && canRespond ? (
                  <>
                    <Button
                      style={{ backgroundColor: '#10b981', color: '#fff' }}
                      onClick={() => {}}
                    >
                      {t('missions.accept')}
                    </Button>
                    <Button
                      style={{ backgroundColor: '#ef4444', color: '#fff' }}
                      onClick={() => setShowRejectModal(true)}
                    >
                      {t('missions.reject')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      style={{ backgroundColor: '#10b981', color: '#fff' }}
                      onClick={handleAcceptApplication}
                      disabled={isRejecting}
                    >
                      {t('missions.accept')}
                    </Button>
                    <Button
                      style={{ backgroundColor: '#ef4444', color: '#fff' }}
                      onClick={() => setShowApplicationRejectModal(true)}
                      disabled={isRejecting}
                    >
                      {t('missions.reject')}
                    </Button>
                  </>
                )}
              </div>
            ) : null}
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            {userRole === 'expert' ? (
              <>
                <FaBuilding className="w-3 h-3 inline mr-1" />
                {t('missions.company')}: {company?.name || t('missions.unknown')}
              </>
            ) : (
              <>
                <FaUser className="w-3 h-3 inline mr-1" />
                {t('missions.expert')}: {expert?.name || t('missions.unknown')}
              </>
            )}
          </p>
          
          {(assignedMission.missionId || (isApplicationRequest && assignedMission.mission)) && (
            <div className="mb-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex items-start justify-between">
                {assignedMission.mission ? (
                  <>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {t('missions.forMission')}: {assignedMission.mission.title}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {assignedMission.mission.description}
                      </p>
                    </div>
                    {userRole === 'expert' && (
                      <Button
                        variant="secondary"
                        onClick={handleViewMission}
                        className="ml-3 flex items-center space-x-1 flex-shrink-0"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>{t('missions.viewMission')}</span>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex-1 flex items-center space-x-2">
                      <FaExclamationTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        {t('missions.missionDeleted') || 'This mission has been deleted by the company.'}
                      </p>
                    </div>
                    {userRole === 'expert' && (
                      <Button
                        variant="secondary"
                        disabled
                        className="ml-3 flex items-center space-x-1 flex-shrink-0 opacity-50 cursor-not-allowed"
                      >
                        <FaExclamationTriangle className="w-4 h-4" />
                        <span>{t('missions.missionDeleted') || 'Mission Deleted'}</span>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>{t('missions.requestDate')}: {new Date(assignedMission.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        t={t}
        isLoading={isRejecting}
      />
      <RejectionReasonModal
        isOpen={showRejectionReasonModal}
        onClose={() => setShowRejectionReasonModal(false)}
        rejectionReason={assignedMission.hireRequest?.rejectionReason || assignedMission.applicationRequest?.rejectionReason}
        rejectedBy={isHireRequest ? 'expert' : (isApplicationRequest ? 'company' : 'expert')}
        requestType={isApplicationRequest ? 'application' : 'hire'}
        t={t}
      />
      <ApplicationRejectModal
        isOpen={showApplicationRejectModal}
        onClose={() => setShowApplicationRejectModal(false)}
        onConfirm={handleRejectApplication}
        t={t}
        isLoading={isRejecting}
      />
    </>
    );
  }

  return (
    <div className="p-6 rounded-lg border-2 border-gray-200 hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {getStatusIcon(assignedMission.status)}
            <h3 className="text-lg font-semibold text-gray-900">{mission.title}</h3>
            <span 
              className="px-3 py-1 text-xs rounded-full" 
              style={{ backgroundColor: `${colors.linkHover}15`, color: colors.linkHover }}
            >
              {getStatusText(assignedMission.status)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            {userRole === 'expert' ? (
              <>
                <FaBuilding className="w-3 h-3 inline mr-1" />
                {t('missions.company')}: {company?.name || t('missions.unknown')}
              </>
            ) : (
              <>
                <FaUser className="w-3 h-3 inline mr-1" />
                {t('missions.expert')}: {expert?.name || t('missions.unknown')}
              </>
            )}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FaEuroSign className="w-4 h-4" />
              <span>{mission.budget.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')} €</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="w-4 h-4" />
              <span>{mission.durationDays} {t('missions.days')}</span>
            </div>
            {assignedMission.startDate && (
              <span>{t('missions.startDate')}: {assignedMission.startDate}</span>
            )}
            {assignedMission.status === 'completed' && assignedMission.endDate && (
              <span>{t('missions.endDate')}: {assignedMission.endDate}</span>
            )}
          </div>
        </div>
        
        {assignedMission.status === 'active' && (
          <Button>
            {t('missions.openChat')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MissionCard;

