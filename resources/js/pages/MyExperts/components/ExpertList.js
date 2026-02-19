import React from 'react';
import { FaHandshakeAngle } from 'react-icons/fa6';
import Empty from '../../../components/Empty/Empty';
import ExpertCard from './ExpertCard';

const ExpertList = ({ experts, t }) => {
  if (experts.length === 0) {
    return (
      <Empty
        icon={FaHandshakeAngle}
        title={t('myExperts.noExperts')}
        description={t('myExperts.noExpertsDescription') || 'You haven\'t worked with any experts yet.'}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experts.map((expert) => (
        <ExpertCard key={expert.id} expert={expert} t={t} />
      ))}
    </div>
  );
};

export default ExpertList;

