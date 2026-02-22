import React, { useEffect } from 'react';
import { colors } from '../../../constants/colors';

const LoadingSpinner = ({ fullScreen = true }) => {
  useEffect(() => {
    if (fullScreen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [fullScreen]);

  const spinnerContent = (
    <div className="flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div
          className="absolute top-0 left-0 w-full h-full border-4 rounded-full animate-spin"
          style={{
            borderColor: `${colors.linkHover}20`,
            borderTopColor: colors.linkHover,
          }}
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(2px)',
        }}
      >
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;

