/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#2563eb',
      },
      boxShadow: {
        'soft-lg': '0 18px 45px rgba(15, 23, 42, 0.14)',
        glass: '0 10px 28px rgba(37, 99, 235, 0.12)',
      },
      borderRadius: {
        lg2: '14px',
        xl2: '18px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
