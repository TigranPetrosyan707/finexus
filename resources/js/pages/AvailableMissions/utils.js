export const filterMissions = (missions, searchQuery, filters, t) => {
  return missions.filter(mission => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = mission.title?.toLowerCase().includes(query);
      const descriptionMatch = mission.description?.toLowerCase().includes(query);
      const companyMatch = mission.company?.name?.toLowerCase().includes(query);
      const locationMatch = mission.location?.toLowerCase().includes(query);
      
      if (!titleMatch && !descriptionMatch && !companyMatch && !locationMatch) {
        return false;
      }
    }

    if (filters.minBudget !== undefined && filters.maxBudget !== undefined) {
      const missionMinBudget = mission.minBudget !== undefined ? mission.minBudget : (mission.budget || 0);
      const missionMaxBudget = mission.maxBudget !== undefined ? mission.maxBudget : (mission.budget || 0);
      
      if (missionMaxBudget < filters.minBudget || missionMinBudget > filters.maxBudget) {
        return false;
      }
    }

    if (filters.minDuration !== undefined && filters.minDuration > 0) {
      const duration = mission.durationDays || 0;
      if (duration < filters.minDuration) {
        return false;
      }
    }

    if (filters.location && filters.location !== 'all') {
      if (mission.location !== filters.location) {
        return false;
      }
    }

    if (filters.section && filters.section !== 'all') {
      if (mission.section !== filters.section) {
        return false;
      }
    }

    return true;
  });
};

