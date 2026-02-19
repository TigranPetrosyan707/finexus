import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { expertsDB } from '../db';
import { filterExperts, formatExpertData } from '../utils';
import useDebounce from '../../../hooks/useDebounce';

const DEFAULT_FILTERS = {
  minPrice: 0,
  maxPrice: 1000,
  minExperience: 0,
  maxExperience: 11,
  verifiedOnly: false
};

export const useSearchExperts = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 800);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    const loadExperts = async () => {
      try {
        setLoading(true);
        const expertsData = await expertsDB.getAllExperts();
        const formattedExperts = expertsData.map(formatExpertData);
        setExperts(formattedExperts);
      } catch (error) {
        console.error('Error loading experts:', error);
        setExperts([]);
      } finally {
        setLoading(false);
      }
    };

    loadExperts();
  }, []);

  const filteredExperts = useMemo(() => {
    if (loading) return [];
    return filterExperts(experts, debouncedSearchQuery, appliedFilters, t);
  }, [experts, debouncedSearchQuery, appliedFilters, t, loading]);

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

  const resetPriceFilter = () => {
    const updatedFilters = {
      ...filters,
      minPrice: DEFAULT_FILTERS.minPrice,
      maxPrice: DEFAULT_FILTERS.maxPrice
    };
    setFilters(updatedFilters);
    setAppliedFilters(updatedFilters);
  };

  const resetExperienceFilter = () => {
    const updatedFilters = {
      ...filters,
      minExperience: DEFAULT_FILTERS.minExperience,
      maxExperience: DEFAULT_FILTERS.maxExperience
    };
    setFilters(updatedFilters);
    setAppliedFilters(updatedFilters);
  };

  const resetVerifiedFilter = () => {
    const updatedFilters = {
      ...filters,
      verifiedOnly: DEFAULT_FILTERS.verifiedOnly
    };
    setFilters(updatedFilters);
    setAppliedFilters(updatedFilters);
  };

  const hasActiveFilters = useMemo(() => {
    return (filters.minPrice !== DEFAULT_FILTERS.minPrice || 
            filters.maxPrice !== DEFAULT_FILTERS.maxPrice) || 
           (filters.minExperience !== DEFAULT_FILTERS.minExperience || 
            filters.maxExperience !== DEFAULT_FILTERS.maxExperience) || 
           filters.verifiedOnly;
  }, [filters]);

  const hasActivePriceFilter = useMemo(() => {
    return filters.minPrice !== DEFAULT_FILTERS.minPrice || 
           filters.maxPrice !== DEFAULT_FILTERS.maxPrice;
  }, [filters]);

  const hasActiveExperienceFilter = useMemo(() => {
    return filters.minExperience !== DEFAULT_FILTERS.minExperience || 
           filters.maxExperience !== DEFAULT_FILTERS.maxExperience;
  }, [filters]);

  const hasActiveVerifiedFilter = useMemo(() => {
    return filters.verifiedOnly;
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.minPrice !== DEFAULT_FILTERS.minPrice || 
        appliedFilters.maxPrice !== DEFAULT_FILTERS.maxPrice) {
      count++;
    }
    if (appliedFilters.minExperience !== DEFAULT_FILTERS.minExperience || 
        appliedFilters.maxExperience !== DEFAULT_FILTERS.maxExperience) {
      count++;
    }
    if (appliedFilters.verifiedOnly) {
      count++;
    }
    return count;
  }, [appliedFilters]);

  return {
    searchQuery,
    setSearchQuery,
    experts,
    loading,
    filteredExperts,
    filters,
    appliedFilters,
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
    activeFiltersCount
  };
};

