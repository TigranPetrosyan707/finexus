import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import Input from '../../../components/UI/Input/Input';

const SearchBar = ({ searchQuery, onSearchChange, onToggleFilters, showFilters, activeFiltersCount, hasMissions }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 sticky top-6 z-20">
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={t('availableMissions.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3"
          />
        </div>
        {hasMissions && (
          <button
            onClick={onToggleFilters}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors relative flex-shrink-0"
            style={{
              color: showFilters ? colors.linkHover : '#6b7280'
            }}
          >
            <FaFilter className="w-5 h-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-semibold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

