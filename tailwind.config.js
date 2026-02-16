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
               }
          },
     },
     plugins: [],
}
