import React from 'react';
import { FaBriefcase } from 'react-icons/fa';
import Empty from '../../../components/Empty/Empty';
import MissionCard from './MissionCard';

const MissionList = ({ missions, userRole, t, i18n, onStatusChange }) => {
  if (missions.length === 0) {
    return (
      <Empty
        icon={FaBriefcase}
        title={t('missions.noMissions')}
        description={t('missions.noMissionsDescription') || 'You don\'t have any missions yet.'}
      />
    );
  }

  return (
    <div className="space-y-4">
      {missions.map((assignedMission) => (
        <MissionCard
          key={assignedMission.id}
          assignedMission={assignedMission}
          userRole={userRole}
          t={t}
          i18n={i18n}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default MissionList;

