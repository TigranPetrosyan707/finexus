import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FaEuroSign, FaClock, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';
import { formatMissionDate, getSectorOptions } from '../../PostMission/utils';
import { useApplicationRequest } from '../../HireRequests/hooks/useApplicationRequest';

const MissionCard = ({ mission, t, i18n }) => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const {
    hasPendingApplication,
    hasAcceptedApplication,
    hasRejectedApplication,
    sendApplicationRequest,
    isSending,
  } = useApplicationRequest(mission?.id);
  
  if (!mission) return null;

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{mission.title}</h3>
              {mission.company && (
                <p className="text-sm text-gray-600 mb-2">
                  {t('availableMissions.company')}: <span className="font-semibold">{mission.company.name}</span>
                </p>
              )}
              {mission.postedDate && (
                <p className="text-sm text-gray-600 mb-2">
                  {t('postMission.posted')}: {formatMissionDate(mission.postedDate, i18n.language)}
                </p>
              )}
            </div>
          </div>

          {mission.description && (
            <p className="text-gray-700 mb-4">{mission.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaEuroSign className="w-4 h-4" style={{ color: colors.linkHover }} />
              <span>
                {mission.minBudget !== undefined && mission.maxBudget !== undefined
                  ? `${mission.minBudget.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')} - ${mission.maxBudget.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')}`
                  : mission.budget
                    ? `${mission.budget.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')}`
                    : '0'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaClock className="w-4 h-4" style={{ color: colors.linkHover }} />
              <span>{mission.durationDays} {t('postMission.days')}</span>
            </div>
            {mission.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FaMapMarkerAlt className="w-4 h-4" style={{ color: colors.linkHover }} />
                <span>{t(`postMission.locations.${mission.location}`)}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaCalendarAlt className="w-4 h-4" style={{ color: colors.linkHover }} />
              <span>
                {mission.startDate ? formatMissionDate(mission.startDate, i18n.language) : '-'}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">{t('postMission.requirementsTitle')}:</p>
            <div className="flex flex-wrap gap-2">
              {mission.section && (
                <span
                  className="px-3 py-1 text-xs rounded-full font-medium"
                  style={{ backgroundColor: `${colors.linkHover}15`, color: colors.linkHover }}
                >
                  {getSectorOptions(t).find(opt => opt.value === mission.section)?.label || mission.section}
                </span>
              )}
              {mission.requirements && mission.requirements.length > 0 && mission.requirements.map((req, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs rounded-full font-medium"
                  style={{ backgroundColor: `${colors.linkHover}15`, color: colors.linkHover }}
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 lg:min-w-[200px]">
          {userRole === 'expert' ? (
            <>
              {hasPendingApplication ? (
                <Button 
                  className="w-full"
                  disabled
                  style={{ backgroundColor: '#f59e0b', color: '#fff' }}
                >
                  {t('availableMissions.applicationPending') || 'Pending'}
                </Button>
              ) : hasAcceptedApplication ? (
                <Button 
                  className="w-full"
                  disabled
                  style={{ backgroundColor: '#10b981', color: '#fff' }}
                >
                  {t('availableMissions.applicationAccepted') || 'Application Accepted'}
                </Button>
              ) : hasRejectedApplication ? (
                <Button 
                  className="w-full"
                  disabled
                  style={{ backgroundColor: '#ef4444', color: '#fff' }}
                >
                  {t('availableMissions.applicationRejected') || 'Application Rejected'}
                </Button>
              ) : (
                <Button 
                  className="w-full"
                  onClick={() => sendApplicationRequest(mission.id)}
                  disabled={isSending}
                >
                  {isSending 
                    ? (t('availableMissions.applying') || 'Applying...')
                    : t('availableMissions.apply')}
                </Button>
              )}
            </>
          ) : (
            <Button className="w-full">
              {t('availableMissions.apply')}
            </Button>
          )}
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => navigate(`/available-missions/${mission.id}`)}
          >
            {t('availableMissions.viewDetails')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;

