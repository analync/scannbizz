/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7ccafb',
          400: '#36b1f7',
          500: '#0c98e9',
          600: '#0077c7',
          700: '#0061a2',
          800: '#005385',
          900: '#00456f',
          950: '#002b49',
        },
        secondary: {
          50: '#f0f7fa',
          100: '#dbeef5',
          200: '#bce0ec',
          300: '#8dcadd',
          400: '#56adca',
          500: '#358fb1',
          600: '#297595',
          700: '#246079',
          800: '#225064',
          900: '#204456',
          950: '#112c39',
        },
        accent: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc070',
          400: '#ff9736',
          500: '#ff7a10',
          600: '#ff5c03',
          700: '#cc4307',
          800: '#a1340f',
          900: '#832d10',
          950: '#461305',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      animation: {
        'scan-line': 'scan-line 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
          '50.1%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0%)' }
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};