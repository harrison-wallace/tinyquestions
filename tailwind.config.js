/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-gray-100', 'bg-gray-800', 'bg-gray-700', 'bg-gray-900',
    'text-gray-800', 'text-gray-200', 'text-gray-500', 'text-gray-400',
    'text-blue-600', 'text-blue-400', 'text-red-600', 'text-red-400',
    'text-green-600', 'bg-blue-600', 'bg-blue-500', 'bg-blue-700',
    'bg-yellow-500', 'bg-yellow-400', 'bg-yellow-600', 'bg-yellow-100',
    'bg-yellow-900', 'bg-green-600', 'bg-green-500', 'bg-green-700',
    'bg-red-500', 'bg-red-600', 'bg-red-700', 'border-gray-300',
    'border-gray-600', 'bg-white',
    'dark:bg-gray-800', // Ensure this class is included
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}