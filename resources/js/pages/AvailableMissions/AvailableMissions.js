import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBriefcase } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import { useAvailableMissions } from './hooks/useAvailableMissions';
import MissionList from './components/MissionList';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';

const AvailableMissions = () => {
  const { t, i18n } = useTranslation();
  const [showFilters, setShowFilters] = useState(true);
  const {
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
  } = useAvailableMissions();

  const hasDataInDb = totalMissions > 0;

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
                {t('availableMissions.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <FaBriefcase className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('availableMissions.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {hasDataInDb && (
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
              onResetBudgetFilter={resetBudgetFilter}
              onResetDurationFilter={resetDurationFilter}
              onResetLocationFilter={resetLocationFilter}
              onResetSectionFilter={resetSectionFilter}
              onApplyFilters={applyFilters}
              showFilters={showFilters}
              onCloseFilters={() => setShowFilters(false)}
              hasActiveFilters={hasActiveFilters}
              hasActiveBudgetFilter={hasActiveBudgetFilter}
              hasActiveDurationFilter={hasActiveDurationFilter}
              hasActiveLocationFilter={hasActiveLocationFilter}
              hasActiveSectionFilter={hasActiveSectionFilter}
            />
          )}

          <div className="flex-1">
            {hasDataInDb && (
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={submitSearch}
                onToggleFilters={() => setShowFilters(!showFilters)}
                showFilters={showFilters}
                activeFiltersCount={activeFiltersCount}
                hasMissions
              />
            )}

            <MissionList missions={missions} t={t} i18n={i18n} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableMissions;

