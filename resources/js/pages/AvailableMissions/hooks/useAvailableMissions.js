import { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import useDebounce from '../../../hooks/useDebounce';

const DEFAULT_FILTERS = {
  search: '',
  minBudget: 0,
  maxBudget: 1000,
  minDuration: 0,
  location: 'all',
  section: 'all'
};

export const useAvailableMissions = () => {
  const { props } = usePage();
  const initialMissions = props.missions || [];
  const initialFilters = props.filters || DEFAULT_FILTERS;

  const [filters, setFilters] = useState(initialFilters);
  const searchQuery = filters.search || '';
  const debouncedSearch = useDebounce(searchQuery, 500);
  const filtersRef = useRef(filters);
  const skipFirstSearchRef = useRef(true);

  filtersRef.current = filters;

  useEffect(() => {
    setFilters(initialFilters);
  }, [
    initialFilters.search,
    initialFilters.minBudget,
    initialFilters.maxBudget,
    initialFilters.minDuration,
    initialFilters.location,
    initialFilters.section
  ]);

  useEffect(() => {
    if (skipFirstSearchRef.current) {
      skipFirstSearchRef.current = false;
      return;
    }
    router.get('/available-missions', { ...filtersRef.current, search: debouncedSearch }, { preserveState: false });
  }, [debouncedSearch]);

  const missions = initialMissions;
  const totalMissions = typeof props.totalMissions === 'number' ? props.totalMissions : 0;

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    router.get('/available-missions', filters, { preserveState: false });
  };

  const resetFilters = () => {
    const next = {
      ...filters,
      minBudget: DEFAULT_FILTERS.minBudget,
      maxBudget: DEFAULT_FILTERS.maxBudget,
      minDuration: DEFAULT_FILTERS.minDuration,
      location: DEFAULT_FILTERS.location,
      section: DEFAULT_FILTERS.section,
    };
    setFilters(next);
    router.get('/available-missions', next, { preserveState: false });
  };

  const resetBudgetFilter = () => {
    const next = { ...filters, minBudget: DEFAULT_FILTERS.minBudget, maxBudget: DEFAULT_FILTERS.maxBudget };
    setFilters(next);
    router.get('/available-missions', next, { preserveState: false });
  };

  const resetDurationFilter = () => {
    const next = { ...filters, minDuration: DEFAULT_FILTERS.minDuration };
    setFilters(next);
    router.get('/available-missions', next, { preserveState: false });
  };

  const resetLocationFilter = () => {
    const next = { ...filters, location: DEFAULT_FILTERS.location };
    setFilters(next);
    router.get('/available-missions', next, { preserveState: false });
  };

  const resetSectionFilter = () => {
    const next = { ...filters, section: DEFAULT_FILTERS.section };
    setFilters(next);
    router.get('/available-missions', next, { preserveState: false });
  };

  const hasActiveFilters =
    filters.minBudget !== DEFAULT_FILTERS.minBudget ||
    filters.maxBudget !== DEFAULT_FILTERS.maxBudget ||
    filters.minDuration > DEFAULT_FILTERS.minDuration ||
    filters.location !== DEFAULT_FILTERS.location ||
    filters.section !== DEFAULT_FILTERS.section;

  const hasActiveBudgetFilter = filters.minBudget !== DEFAULT_FILTERS.minBudget || filters.maxBudget !== DEFAULT_FILTERS.maxBudget;
  const hasActiveDurationFilter = filters.minDuration > DEFAULT_FILTERS.minDuration;
  const hasActiveLocationFilter = filters.location !== DEFAULT_FILTERS.location;
  const hasActiveSectionFilter = filters.section !== DEFAULT_FILTERS.section;

  const activeFiltersCount =
    ((filters.minBudget !== 0 || filters.maxBudget !== 1000) ? 1 : 0) +
    (filters.minDuration > 0 ? 1 : 0) +
    (filters.location !== 'all' ? 1 : 0) +
    (filters.section !== 'all' ? 1 : 0);

  const setSearchQuery = (value) => setFilters(prev => ({ ...prev, search: value }));

  const submitSearch = () => {
    router.get('/available-missions', { ...filters, search: filters.search }, { preserveState: false });
  };

  return {
    missions,
    totalMissions,
    searchQuery,
    setSearchQuery,
    submitSearch,
    filters,
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
