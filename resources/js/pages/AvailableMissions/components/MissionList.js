import React from 'react';
import { FaBriefcase } from 'react-icons/fa';
import Empty from '../../../components/Empty/Empty';
import MissionCard from './MissionCard';

const MissionList = ({ missions, t, i18n }) => {
  if (missions.length === 0) {
    return (
      <Empty
        icon={FaBriefcase}
        title={t('availableMissions.noMissions') || 'No missions available'}
        description={t('availableMissions.noMissionsDescription') || 'There are no available missions at the moment.'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} t={t} i18n={i18n} />
      ))}
    </div>
  );
};

export default MissionList;

