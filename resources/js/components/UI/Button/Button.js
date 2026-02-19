import React from 'react';
import { colors } from '../../../constants/colors';

const Button = ({
  as: Component = 'button',
  type = 'button',
  onClick,
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'font-bold shadow-md hover:shadow-lg',
    secondary: 'font-medium bg-gray-100 text-gray-700 hover:bg-gray-200',
  };

  const style = variant === 'primary' 
    ? { backgroundColor: colors.buttonBackground, color: colors.buttonText }
    : {};

  return (
    <Component
      type={Component === 'button' ? type : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={variant === 'primary' ? style : {}}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;

