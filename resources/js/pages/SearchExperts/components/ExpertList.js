import React from 'react';
import ExpertCard from './ExpertCard';
import Empty from '../../../components/Empty/Empty';
import { FaSearch } from 'react-icons/fa';
import { MdPersonSearch } from 'react-icons/md';

const ExpertList = ({ experts, t }) => {
  if (experts.length === 0) {
    return (
      <Empty
        icon={FaSearch}
        title={t('searchExperts.noResults')}
        description={t('searchExperts.noResultsDescription')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {experts.map((expert) => (
        <ExpertCard key={expert.id} expert={expert} t={t} />
      ))}
    </div>
  );
};

export const EmptyExperts = ({ t }) => (
  <Empty
    icon={MdPersonSearch}
    title={t('searchExperts.noExperts')}
    description={t('searchExperts.noExpertsDescription')}
  />
);

export default ExpertList;

