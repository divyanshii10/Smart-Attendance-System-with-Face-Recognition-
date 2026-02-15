/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
          colors: {

        primary: "#7C3AED",
        secondary: "#9333EA",

        appBg: "#020617",
        sectionBg: "#030A1A",
        cardBg: "#0B1220",

        textPrimary: "#FFFFFF",
        textSecondary: "#9CA3AF",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        tech: ['Orbitron', 'Rajdhani', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan-line 2s linear infinite',
        'radar-sweep': 'radar-sweep 3s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'count-up 1s ease-out',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.6), 0 0 60px rgba(0, 255, 255, 0.4)',
          },
        },
        'scan-line': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'count-up': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'glow': {
          '0%, 100%': { 
            filter: 'brightness(1)',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
          },
          '50%': { 
            filter: 'brightness(1.3)',
            textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.6)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
    'card-glow':
      '0 0 30px rgba(124,58,237,0.15)',
      }
    },
  },
  plugins: [],
};
