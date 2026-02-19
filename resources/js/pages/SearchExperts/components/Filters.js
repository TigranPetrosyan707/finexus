import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Button from '../../../components/UI/Button/Button';

const Filters = ({ 
  filters, 
  onFilterChange, 
  onResetFilters, 
  onResetPriceFilter,
  onResetExperienceFilter,
  onResetVerifiedFilter,
  onApplyFilters, 
  showFilters, 
  onCloseFilters, 
  hasActiveFilters,
  hasActivePriceFilter,
  hasActiveExperienceFilter,
  hasActiveVerifiedFilter
}) => {
  const { t } = useTranslation();

  if (!showFilters) return null;

  return (
    <div className="lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FaFilter className="w-4 h-4" style={{ color: colors.linkHover }} />
            {t('searchExperts.filters')}
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
                {t('searchExperts.filters.priceRange')}
              </label>
              {hasActivePriceFilter && (
                <button
                  onClick={onResetPriceFilter}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                  title={t('searchExperts.filters.clear')}
                >
                  <FaTimes className="w-3 h-3" />
                  <span>{t('searchExperts.filters.clear')}</span>
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: colors.linkHover }}>
                  {filters.minPrice} € - {filters.maxPrice} €
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700 font-medium">Min: {filters.minPrice} €</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.minPrice}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      if (newMin < filters.maxPrice - 10) {
                        onFilterChange('minPrice', newMin);
                      } else if (newMin >= filters.maxPrice - 10) {
                        onFilterChange('minPrice', Math.max(0, filters.maxPrice - 10));
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
                    <span className="text-sm text-gray-700 font-medium">Max: {filters.maxPrice} €</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.maxPrice}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      if (newMax > filters.minPrice + 10) {
                        onFilterChange('maxPrice', newMax);
                      } else if (newMax <= filters.minPrice + 10) {
                        onFilterChange('maxPrice', Math.min(1000, filters.minPrice + 10));
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
                <span>0 €</span>
                <span>1000 €</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('searchExperts.filters.experienceRange')}
              </label>
              {hasActiveExperienceFilter && (
                <button
                  onClick={onResetExperienceFilter}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                  title={t('searchExperts.filters.clear')}
                >
                  <FaTimes className="w-3 h-3" />
                  <span>{t('searchExperts.filters.clear')}</span>
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: colors.linkHover }}>
                  {filters.minExperience} - {filters.maxExperience === 11 ? '10+' : filters.maxExperience} {filters.maxExperience === 11 ? 'years' : 'years'}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700 font-medium">Min: {filters.minExperience} years</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="11"
                    step="1"
                    value={filters.minExperience}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      if (newMin < filters.maxExperience - 1) {
                        onFilterChange('minExperience', newMin);
                      } else if (newMin >= filters.maxExperience - 1) {
                        onFilterChange('minExperience', Math.max(0, filters.maxExperience - 1));
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
                    <span className="text-sm text-gray-700 font-medium">Max: {filters.maxExperience === 11 ? '10+' : filters.maxExperience} years</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="11"
                    step="1"
                    value={filters.maxExperience}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      if (newMax > filters.minExperience + 1) {
                        onFilterChange('maxExperience', newMax);
                      } else if (newMax <= filters.minExperience + 1) {
                        onFilterChange('maxExperience', Math.min(11, filters.minExperience + 1));
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
                <span>0 years</span>
                <span>10+ years</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('searchExperts.filters.verifiedOnly')}
              </label>
              {hasActiveVerifiedFilter && (
                <button
                  onClick={onResetVerifiedFilter}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
                  title={t('searchExperts.filters.clear')}
                >
                  <FaTimes className="w-3 h-3" />
                  <span>{t('searchExperts.filters.clear')}</span>
                </button>
              )}
            </div>
            <label className={`flex items-center space-x-3 cursor-pointer p-2.5 rounded-lg transition-all border-2 ${
              filters.verifiedOnly
                ? 'bg-blue-50'
                : 'border-transparent hover:bg-gray-50'
            }`}
              style={{
                borderColor: filters.verifiedOnly ? colors.linkHover : 'transparent'
              }}
            >
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => onFilterChange('verifiedOnly', e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: colors.linkHover }}
              />
              <span className="text-sm font-medium text-gray-700">{t('searchExperts.filters.verifiedOnly')}</span>
            </label>
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

