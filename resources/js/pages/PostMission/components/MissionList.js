import React from 'react';
import { MdWorkHistory } from 'react-icons/md';
import Empty from '../../../components/Empty/Empty';
import MissionCard from './MissionCard';

const MissionList = ({ missions, onEdit, onDelete, t, locale }) => {
  if (missions.length === 0) {
    return (
      <Empty
        icon={MdWorkHistory}
        title={t('postMission.noMissions')}
        description={t('postMission.noMissionsDescription') || 'You haven\'t posted any missions yet. Create your first mission to get started!'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          onEdit={onEdit}
          onDelete={onDelete}
          t={t}
          locale={locale}
        />
      ))}
    </div>
  );
};

export default MissionList;

