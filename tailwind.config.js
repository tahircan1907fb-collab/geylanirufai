/** @type {import('tailwindcss').Config} */
export default {
     content: [
          "./index.html",
          "./src/**/*.{js,ts,jsx,tsx}",
          "./components/**/*.{js,ts,jsx,tsx}",
          "./*.{js,ts,jsx,tsx}"
     ],
     theme: {
          extend: {
               colors: {
                    emerald: {
                         800: '#065f46',
                         900: '#064e3b',
                    },
                    gold: {
                         400: '#E5C15D',
                         500: '#D4AF37', // Classic Gold
                         600: '#B59226',
                    },
                    navy: {
                         900: '#0F172A',
                    },
                    cream: {
                         50: '#FDFBF7',
                         100: '#F7F3E8',
                    }
               },
               fontFamily: {
                    serif: ['Amiri', 'serif'],
                    heading: ['Cinzel', 'serif'],
                    sans: ['Inter', 'sans-serif'],

               },
               animation: {
                    'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                    'fade-in': 'fadeIn 1s ease-out forwards',
                    'slide-up': 'slideUp 0.5s ease-out forwards',
               },
               keyframes: {
                    fadeInUp: {
                         '0%': { opacity: '0', transform: 'translateY(20px)' },
                         '100%': { opacity: '1', transform: 'translateY(0)' },
                    },
                    fadeIn: {
                         '0%': { opacity: '0' },
                         '100%': { opacity: '1' },
                    },
                    slideUp: {
                         '0%': { transform: 'translateY(100%)', opacity: '0' },
                         '100%': { transform: 'translateY(0)', opacity: '1' },
                    }
               }
          },
     },
     plugins: [],
}
