import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import { MdPersonSearch } from 'react-icons/md';
import { colors } from '../../constants/colors';
import Empty from '../../components/Empty/Empty';
import { useSearchExperts } from './hooks/useSearchExperts';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import ExpertList, { EmptyExperts } from './components/ExpertList';

const SearchExperts = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(true);

  const {
    searchQuery,
    setSearchQuery,
    submitSearch,
    experts,
    totalExperts,
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
    activeFiltersCount
  } = useSearchExperts();

  const hasDataInDb = totalExperts > 0;

  return (
    <div className="relative overflow-hidden min-h-screen" style={{ backgroundColor: colors.sectionGray }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.linkHover, transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.buttonBackground, transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {t('searchExperts.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <MdPersonSearch className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('searchExperts.subtitle')}
            </p>
          </div>
        </div>

        {!hasDataInDb ? (
          <EmptyExperts t={t} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
              onResetPriceFilter={resetPriceFilter}
              onResetExperienceFilter={resetExperienceFilter}
              onResetVerifiedFilter={resetVerifiedFilter}
              onApplyFilters={applyFilters}
              showFilters={showFilters}
              onCloseFilters={() => setShowFilters(false)}
              hasActiveFilters={hasActiveFilters}
              hasActivePriceFilter={hasActivePriceFilter}
              hasActiveExperienceFilter={hasActiveExperienceFilter}
              hasActiveVerifiedFilter={hasActiveVerifiedFilter}
            />

            <div className="flex-1">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={submitSearch}
                onToggleFilters={() => setShowFilters(!showFilters)}
                showFilters={showFilters}
                activeFiltersCount={activeFiltersCount}
              />

              {experts.length === 0 ? (
                <Empty
                  icon={FaSearch}
                  title={t('searchExperts.noResults')}
                  description={t('searchExperts.noResultsDescription')}
                />
              ) : (
                <ExpertList experts={experts} t={t} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchExperts;
