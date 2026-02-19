import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Input = React.forwardRef(({
  id,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base';
  const enabledClasses = 'border-gray-300';
  const disabledClasses = 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed';

  const inputProps = {
    ref,
    id,
    name,
    type: inputType,
    placeholder,
    onChange,
    required,
    disabled,
    className: `${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${isPassword ? 'pr-10' : ''} ${className}`,
    ...props,
  };

  if (value !== undefined) {
    inputProps.value = value;
  }

  if (isPassword) {
    return (
      <div className="relative">
        <input {...inputProps} />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
          tabIndex={-1}
        >
          {showPassword ? (
            <FaEyeSlash className="w-5 h-5" />
          ) : (
            <FaEye className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  }

  return <input {...inputProps} />;
});

Input.displayName = 'Input';

export default Input;

