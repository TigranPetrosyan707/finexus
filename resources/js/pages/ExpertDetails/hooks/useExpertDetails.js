import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { formatExpertProfile } from '../../ExpertProfile/db/schema';

export const useExpertDetails = (expertId) => {
  const { props } = usePage();
  const initialExpert = props.expert ?? null;
  const initialAssignedMissions = props.assignedMissions ?? [];

  const profile = useMemo(() => {
    if (!initialExpert) return null;
    const completed = (initialAssignedMissions || []).filter(m => m.status === 'completed').length;
    const stats = { completedMissions: completed };
    return formatExpertProfile(initialExpert, stats);
  }, [initialExpert, initialAssignedMissions]);

  const loading = false;

  return { profile, loading };
};

