import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { formatExpertData } from '../utils';

const DEFAULT_FILTERS = {
  search: '',
  minPrice: 0,
  maxPrice: 1000,
  minExperience: 0,
  maxExperience: 11,
  verifiedOnly: false,
};

export const useSearchExperts = () => {
  const { props } = usePage();
  const initialExperts = props.experts || [];
  const initialFilters = props.filters || DEFAULT_FILTERS;
  const totalExperts = typeof props.totalExperts === 'number' ? props.totalExperts : 0;

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters.search, initialFilters.minPrice, initialFilters.maxPrice, initialFilters.minExperience, initialFilters.maxExperience, initialFilters.verifiedOnly]);

  const experts = initialExperts.map(formatExpertData);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    router.get('/search-experts', filters, { preserveState: false });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    router.get('/search-experts', DEFAULT_FILTERS, { preserveState: false });
  };

  const resetPriceFilter = () => {
    const next = { ...filters, minPrice: DEFAULT_FILTERS.minPrice, maxPrice: DEFAULT_FILTERS.maxPrice };
    setFilters(next);
    router.get('/search-experts', next, { preserveState: false });
  };

  const resetExperienceFilter = () => {
    const next = { ...filters, minExperience: DEFAULT_FILTERS.minExperience, maxExperience: DEFAULT_FILTERS.maxExperience };
    setFilters(next);
    router.get('/search-experts', next, { preserveState: false });
  };

  const resetVerifiedFilter = () => {
    const next = { ...filters, verifiedOnly: DEFAULT_FILTERS.verifiedOnly };
    setFilters(next);
    router.get('/search-experts', next, { preserveState: false });
  };

  const hasActiveFilters =
    (filters.search || '') !== '' ||
    filters.minPrice !== DEFAULT_FILTERS.minPrice ||
    filters.maxPrice !== DEFAULT_FILTERS.maxPrice ||
    filters.minExperience !== DEFAULT_FILTERS.minExperience ||
    filters.maxExperience !== DEFAULT_FILTERS.maxExperience ||
    filters.verifiedOnly;

  const hasActivePriceFilter = filters.minPrice !== DEFAULT_FILTERS.minPrice || filters.maxPrice !== DEFAULT_FILTERS.maxPrice;
  const hasActiveExperienceFilter = filters.minExperience !== DEFAULT_FILTERS.minExperience || filters.maxExperience !== DEFAULT_FILTERS.maxExperience;
  const hasActiveVerifiedFilter = filters.verifiedOnly;

  let activeFiltersCount = 0;
  if ((filters.search || '') !== '') activeFiltersCount++;
  if (filters.minPrice !== DEFAULT_FILTERS.minPrice || filters.maxPrice !== DEFAULT_FILTERS.maxPrice) activeFiltersCount++;
  if (filters.minExperience !== DEFAULT_FILTERS.minExperience || filters.maxExperience !== DEFAULT_FILTERS.maxExperience) activeFiltersCount++;
  if (filters.verifiedOnly) activeFiltersCount++;

  const setSearchQuery = (value) => setFilters(prev => ({ ...prev, search: value }));
  const searchQuery = filters.search || '';

  const submitSearch = () => {
    router.get('/search-experts', { ...filters, search: filters.search }, { preserveState: false });
  };

  return {
    searchQuery,
    setSearchQuery,
    submitSearch,
    experts,
    totalExperts,
    loading: false,
    filters,
    handleFilterChange,
    applyFilters,
    resetFilters,
    resetPriceFilter,
    resetExperienceFilter,
    resetVerifiedFilter,
    hasActiveFilters,
    hasActivePriceFilter,
    hasActiveExperienceFilter,
    hasActiveVerifiedFilter,
    activeFiltersCount,
  };
};
