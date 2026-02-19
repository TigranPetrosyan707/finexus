import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Empty from '../../../components/Empty/Empty';

const RecentMissions = ({ missions, t }) => {
  if (!missions || missions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {t('dashboard.expert.recentMissions')}
        </h2>
        <Empty
          icon={FaBriefcase}
          title={t('dashboard.expert.noRecentMissions') || 'No recent missions'}
          description={t('dashboard.expert.noRecentMissionsDescription') || 'You don\'t have any recent missions yet.'}
          className="bg-transparent shadow-none border-0"
        />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {t('dashboard.expert.recentMissions')}
      </h2>
      <div className="space-y-4">
        {missions.slice(0, 3).map((assignedMission) => {
          if (!assignedMission.mission) return null;
          
          return (
            <div key={assignedMission.id} className="p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                {assignedMission.mission.title}
              </h3>
              {assignedMission.company && (
                <p className="text-sm text-gray-600 mb-2">
                  {assignedMission.company.name}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {t('dashboard.expert.status')}:{' '}
                  <span className={`font-semibold ${getStatusColor(assignedMission.status)}`}>
                    {t(`missions.status.${assignedMission.status}`)}
                  </span>
                </span>
                <Link to="/missions" className="text-sm" style={{ color: colors.linkHover }}>
                  {t('dashboard.expert.viewDetails')} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentMissions;

