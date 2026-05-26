export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#ffffff',
        accent: '#4A90E2', // iLovePDF-style calm light blue
        accentLight: '#74A9ED',
        accentDark: '#2C73C6',
        background: '#ffffff', // Pure white background
        darkBackground: '#09090b', // Deep dark theme
        darkCard: '#18181b', // Slightly lighter dark card
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
