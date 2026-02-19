import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

const MultiSelect = React.forwardRef(({
  id,
  name,
  value = [],
  onChange,
  options = [],
  placeholder = '',
  className = '',
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (optionValue) => {
    const currentValue = Array.isArray(value) ? value : [];
    if (currentValue.includes(optionValue)) {
      onChange(currentValue.filter(v => v !== optionValue));
    } else {
      onChange([...currentValue, optionValue]);
    }
  };

  const handleRemove = (optionValue, e) => {
    e.stopPropagation();
    const currentValue = Array.isArray(value) ? value : [];
    onChange(currentValue.filter(v => v !== optionValue));
  };

  const selectedLabels = options
    .filter(opt => (Array.isArray(value) ? value : []).includes(opt.value))
    .map(opt => opt.label);

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[48px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base bg-white cursor-pointer flex items-center flex-wrap gap-2 ${className}`}
      >
        {selectedLabels.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          selectedLabels.map((label, index) => {
            const optionValue = options.find(opt => opt.label === label)?.value;
            return (
              <span
                key={optionValue || index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
              >
                {label}
                <button
                  type="button"
                  onClick={(e) => handleRemove(optionValue, e)}
                  className="hover:text-blue-900"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            );
          })
        )}
        <div className="ml-auto">
          <FaChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No options available
            </div>
          ) : (
            options.map((option) => {
              const isSelected = (Array.isArray(value) ? value : []).includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => handleToggle(option.value)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <span className={isSelected ? 'text-blue-700 font-medium' : 'text-gray-900'}>
                    {option.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      <input
        ref={ref}
        type="hidden"
        name={name}
        value={Array.isArray(value) ? value.join(',') : ''}
      />
    </div>
  );
});

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;

