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
        heading: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: '#ffffff',
        accent: '#4A90E2',
        accentLight: '#74A9ED',
        accentDark: '#2C73C6',
        background: '#ffffff',
        darkBackground: '#09090b',
        darkCard: '#18181b',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(74, 144, 226, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'march': 'march 20s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        march: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '100% 100%' },
        }
      }
    },
  },
  plugins: [],
}
