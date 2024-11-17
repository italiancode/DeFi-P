/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        defi: {
          'primary': '#4F46E5',   // Replace with your primary color
          'secondary': '#7C3AED', // Replace with your secondary color
          'dark': '#1F2937',
          'dark-light': '#374151',
          'light': '#F3F4F6',
          'gray': {
            'light': '#9CA3AF',  // Add this for text-defi-gray-light
            'dark': '#4B5563'
          }
        }
      }
    },
  },
  plugins: [],
} 