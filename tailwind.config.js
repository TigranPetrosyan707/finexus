module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    extend: {
      maxWidth: {
        containerMedium: '56rem',
        containerLarge: '73rem',
      },
      zIndex: {
        header: '60',
        headerFixed: '100',
      },
      boxShadow: {
        headerShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        headerShow: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        headerShow: 'headerShow 0.3s ease-out',
      },
      colors: {
        footerBackground: '#253033',
        buttonBackground: '#ffcd04',
        buttonText: '#131313',
        logoutRed: {
          light: '#fef2f2',
          DEFAULT: '#ef4444',
        },
      },
    },
  },
  plugins: [],
}

