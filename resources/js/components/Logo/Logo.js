import React from 'react';

const Logo = ({ className = '', showText = true, variant = 'default' }) => {
  const isLight = variant === 'light';
  const bgColor = isLight ? '#e5e7eb' : '#1f2937';
  const primaryColor = isLight ? '#9ca3af' : '#ffcd04';
  const accentColor = isLight ? '#d1d5db' : '#72c2cb';

  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={showText ? "mr-3" : ""}
      >
        <rect width="40" height="40" rx="8" fill={bgColor}/>
        <rect x="10" y="24" width="4" height="8" rx="2" fill={primaryColor} opacity={isLight ? "0.8" : "1"}/>
        <rect x="16" y="20" width="4" height="12" rx="2" fill={primaryColor} opacity={isLight ? "0.8" : "1"}/>
        <rect x="22" y="16" width="4" height="16" rx="2" fill={primaryColor} opacity={isLight ? "0.8" : "1"}/>
        <rect x="28" y="12" width="4" height="20" rx="2" fill={accentColor} opacity={isLight ? "0.7" : "0.9"}/>
        <path
          d="M12 18L14 16L16 18"
          stroke={bgColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showText && (
        <span className={`text-xl lg:text-2xl font-bold ${isLight ? 'text-white' : 'text-gray-900'}`}>
          Finexus
        </span>
      )}
    </div>
  );
};

export default Logo;
