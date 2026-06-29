/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6657e8',
        accent: '#4fd1a1',
        ink: '#17201d',
        coral: { 600: '#e96861' },
        mint: { 50: '#ecfbf5', 400: '#4fd1a1' },
      },
      boxShadow: {
        'soft-xs': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'soft-sm': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'soft-md': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 16px 40px rgba(0, 0, 0, 0.10)',
        'soft-xl': '0 24px 56px rgba(0, 0, 0, 0.12)',
        'glass': '0 8px 32px rgba(79, 70, 229, 0.10)',
        'glass-sm': '0 4px 16px rgba(79, 70, 229, 0.08)',
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'elevation-2': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'elevation-3': '0 10px 15px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '3xl': '20px',
        '4xl': '24px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
