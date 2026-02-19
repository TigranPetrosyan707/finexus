import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';
import Select from '../../../components/UI/Select/Select';
import { getLocationOptions, getSectorOptions } from '../../PostMission/utils';

const Filters = ({ 
  filters, 
  onFilterChange, 
  onResetFilters,
  onResetBudgetFilter,
  onResetDurationFilter,
  onResetLocationFilter,
  onResetSectionFilter,
  onApplyFilters, 
  showFilters, 
  onCloseFilters, 
  hasActiveFilters,
  hasActiveBudgetFilter,
  hasActiveDurationFilter,
  hasActiveLocationFilter,
  hasActiveSectionFilter
}) => {
  const { t } = useTranslation();

  if (!showFilters) return null;

  const locationOptions = [
    { value: 'all', label: t('availableMissions.filters.allLocations') || 'All Locations' },
    ...getLocationOptions(t)
  ];

  const sectorOptions = [
    { value: 'all', label: t('availableMissions.filters.allSections') || 'All Sections' },
    ...getSectorOptions(t)
  ];

  return (
    <div className="lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6 z-10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FaFilter className="w-4 h-4" style={{ color: colors.linkHover }} />
            {t('availableMissions.filters.title') || t('searchExperts.filters')}
          </h2>
          <button
            onClick={onCloseFilters}
            className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('availableMissions.filters.budgetRange') || t('searchExperts.filters.priceRange')}
              </label>
              {hasActiveBudgetFilter && (
                <button
                  onClick={onResetBudgetFilter}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                  title={t('common.clear')}
                >
                  <FaTimes className="w-3 h-3" />
                  <span>{t('common.clear')}</span>
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: colors.linkHover }}>
                  {filters.minBudget} - {filters.maxBudget} €
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700 font-medium">Min: {filters.minBudget}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.minBudget}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      if (newMin < filters.maxBudget - 10) {
                        onFilterChange('minBudget', newMin);
                      } else if (newMin >= filters.maxBudget - 10) {
                        onFilterChange('minBudget', Math.max(0, filters.maxBudget - 10));
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      accentColor: colors.linkHover
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700 font-medium">Max: {filters.maxBudget}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.maxBudget}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      if (newMax > filters.minBudget + 10) {
                        onFilterChange('maxBudget', newMax);
                      } else if (newMax <= filters.minBudget + 10) {
                        onFilterChange('maxBudget', Math.min(1000, filters.minBudget + 10));
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      accentColor: colors.linkHover
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>0</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('availableMissions.filters.minDuration') || 'Minimum Duration'}
              </label>
              {hasActiveDurationFilter && (
                <button
                  onClick={onResetDurationFilter}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                  title={t('common.clear')}
                >
                  <FaTimes className="w-3 h-3" />
                  <span>{t('common.clear')}</span>
                </button>
              )}
            </div>
            <input
              type="number"
              min="0"
              value={filters.minDuration || 0}
              onChange={(e) => onFilterChange('minDuration', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder={t('availableMissions.filters.durationPlaceholder') || 'Days'}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('availableMissions.filters.location') || t('postMission.form.location')}
              </label>
              {hasActiveLocationFilter && (
                <button
                  onClick={onResetLocationFilter}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                  title={t('common.clear')}
                >
                  <FaTimes className="w-3 h-3" />
                  <span>{t('common.clear')}</span>
                </button>
              )}
            </div>
            <Select
              value={filters.location || 'all'}
              onChange={(e) => onFilterChange('location', e.target.value)}
              options={locationOptions}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('availableMissions.filters.section') || t('postMission.form.section')}
              </label>
              {hasActiveSectionFilter && (
                <button
                  onClick={onResetSectionFilter}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                  title={t('common.clear')}
                >
                  <FaTimes className="w-3 h-3" />
                  <span>{t('common.clear')}</span>
                </button>
              )}
            </div>
            <Select
              value={filters.section || 'all'}
              onChange={(e) => onFilterChange('section', e.target.value)}
              options={sectorOptions}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={onApplyFilters}
              disabled={!hasActiveFilters}
              className="w-full flex items-center justify-center space-x-2 text-sm text-white font-medium"
              style={{
                backgroundColor: hasActiveFilters ? colors.linkHover : '#9ca3af',
                border: 'none',
                cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
                opacity: hasActiveFilters ? 1 : 0.6
              }}
            >
              <FaFilter className="w-3.5 h-3.5" />
              <span>{t('searchExperts.filters.apply')}</span>
            </Button>
            {hasActiveFilters && (
              <Button
                variant="secondary"
                onClick={onResetFilters}
                className="w-full flex items-center justify-center space-x-2 text-sm"
              >
                <FaTimes className="w-3.5 h-3.5" />
                <span>{t('searchExperts.filters.reset')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;

