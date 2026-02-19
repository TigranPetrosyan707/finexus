import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { availableMissionsDB } from '../db';
import { filterMissions } from '../utils';
import useDebounce from '../../../hooks/useDebounce';

const DEFAULT_FILTERS = {
  minBudget: 0,
  maxBudget: 1000,
  minDuration: 0,
  location: 'all',
  section: 'all'
};

export const useAvailableMissions = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 800);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    const loadMissions = async () => {
      try {
        setLoading(true);
        const allMissions = await availableMissionsDB.getAllAvailableMissions();
        setMissions(allMissions);
      } catch (error) {
        console.error('Error loading available missions:', error);
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadMissions();
  }, []);

  const filteredMissions = useMemo(() => {
    if (loading) return [];
    return filterMissions(missions, debouncedSearchQuery, appliedFilters, t);
  }, [missions, debouncedSearchQuery, appliedFilters, t, loading]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const resetBudgetFilter = () => {
    const newFilters = {
      ...filters,
      minBudget: DEFAULT_FILTERS.minBudget,
      maxBudget: DEFAULT_FILTERS.maxBudget
    };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const resetDurationFilter = () => {
    const newFilters = {
      ...filters,
      minDuration: DEFAULT_FILTERS.minDuration
    };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const resetLocationFilter = () => {
    const newFilters = {
      ...filters,
      location: DEFAULT_FILTERS.location
    };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const resetSectionFilter = () => {
    const newFilters = {
      ...filters,
      section: DEFAULT_FILTERS.section
    };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const hasActiveFilters = useMemo(() => {
    return (filters.minBudget !== DEFAULT_FILTERS.minBudget || filters.maxBudget !== DEFAULT_FILTERS.maxBudget) ||
      filters.minDuration > DEFAULT_FILTERS.minDuration ||
      filters.location !== DEFAULT_FILTERS.location ||
      filters.section !== DEFAULT_FILTERS.section;
  }, [filters]);

  const hasActiveBudgetFilter = useMemo(() => {
    return filters.minBudget !== DEFAULT_FILTERS.minBudget || filters.maxBudget !== DEFAULT_FILTERS.maxBudget;
  }, [filters]);

  const hasActiveDurationFilter = useMemo(() => {
    return filters.minDuration > DEFAULT_FILTERS.minDuration;
  }, [filters]);

  const hasActiveLocationFilter = useMemo(() => {
    return filters.location !== DEFAULT_FILTERS.location;
  }, [filters]);

  const hasActiveSectionFilter = useMemo(() => {
    return filters.section !== DEFAULT_FILTERS.section;
  }, [filters]);

  const activeFiltersCount = ((appliedFilters.minBudget !== 0 || appliedFilters.maxBudget !== 1000) ? 1 : 0) + 
    (appliedFilters.minDuration > 0 ? 1 : 0) + 
    (appliedFilters.location !== 'all' ? 1 : 0) + 
    (appliedFilters.section !== 'all' ? 1 : 0);

  return {
    loading,
    missions: filteredMissions,
    allMissions: missions,
    searchQuery,
    setSearchQuery,
    filters,
    appliedFilters,
    handleFilterChange,
    applyFilters,
    resetFilters,
    resetBudgetFilter,
    resetDurationFilter,
    resetLocationFilter,
    resetSectionFilter,
    hasActiveFilters,
    hasActiveBudgetFilter,
    hasActiveDurationFilter,
    hasActiveLocationFilter,
    hasActiveSectionFilter,
    activeFiltersCount,
  };
};

