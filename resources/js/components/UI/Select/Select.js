import React from 'react';

const Select = React.forwardRef(({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = '',
  required = false,
  className = '',
  ...props
}, ref) => {
  const selectClasses = 'w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base bg-white appearance-none';

  return (
    <div className="relative">
      <select
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`${selectClasses} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;

