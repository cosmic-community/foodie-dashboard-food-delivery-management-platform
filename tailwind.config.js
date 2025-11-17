/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f3f4f6',
          foreground: '#1f2937',
        },
        accent: {
          DEFAULT: '#fbbf24',
          foreground: '#1f2937',
        },
        background: '#ffffff',
        foreground: '#1f2937',
        muted: {
          DEFAULT: '#f9fafb',
          foreground: '#6b7280',
        },
        border: '#e5e7eb',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}