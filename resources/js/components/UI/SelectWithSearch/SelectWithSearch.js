import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiChevronDown, HiX } from 'react-icons/hi';

const SelectWithSearch = React.forwardRef(({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = '',
  required = false,
  className = '',
  maxHeight = '200px',
  ...props
}, ref) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [openUpward, setOpenUpward] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchQuery) {
      const filtered = options.filter(option => {
        const label = option.label || option;
        return label.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchQuery, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 300;
        
        setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    const event = {
      target: {
        name: name,
        value: optionValue
      }
    };
    onChange(event);
    setIsOpen(false);
    setSearchQuery('');
  };

  const selectedOption = options.find(opt => (opt.value || opt) === value);
  const displayValue = selectedOption ? (selectedOption.label || selectedOption) : '';

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base bg-white cursor-pointer relative"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {displayValue || placeholder}
        </span>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <HiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg ${
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search') || 'Search...'}
                className="w-full pl-8 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
              {searchQuery && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery('');
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <HiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight }}>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                {t('common.noResults') || 'No results found'}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const optionValue = option.value || option;
                const optionLabel = option.label || option;
                const isSelected = value === optionValue;
                return (
                  <div
                    key={optionValue}
                    onClick={() => handleSelect(optionValue)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                      isSelected ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'
                    }`}
                  >
                    {optionLabel}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <input
        ref={ref}
        type="hidden"
        name={name}
        value={value || ''}
        required={required}
      />
    </div>
  );
});

SelectWithSearch.displayName = 'SelectWithSearch';

export default SelectWithSearch;

