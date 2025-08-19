/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'crypto-green': '#10B981',
        'crypto-red': '#EF4444',
        'crypto-blue': '#3B82F6',
        'crypto-dark': '#1F2937',
        'crypto-darker': '#111827',
        'crypto-light': '#F9FAFB',
        'crypto-gray': '#6B7280',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'price-flash': 'priceFlash 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        priceFlash: {
          '0%': { transform: 'scale(1)', backgroundColor: 'transparent' },
          '50%': { transform: 'scale(1.05)', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
          '100%': { transform: 'scale(1)', backgroundColor: 'transparent' },
        },
      },
    },
  },
  plugins: [],
}
