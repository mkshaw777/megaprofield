/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./main.tsx", 
    "./App.tsx",
    "./components/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
  ],
  safelist: [
    'bg-blue-600',
    'bg-green-500',
    'bg-white',
    'bg-gray-50',
    'bg-gray-100',
    'text-white',
    'p-4',
    'm-2',
    'rounded-lg',
    'shadow-md',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#10B981',
        background: '#F9FAFB',
        text: '#1F2937',
        accent: '#F59E0B',
      },
    },
  },
  plugins: [],
}
