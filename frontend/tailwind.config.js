export default {
  content: [
    "./index.html",
    "./src*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        obsidian: {
          900: '#030303',   
          800: '#0A0A0A',   
          700: '#141414',   
          600: '#1F1F1F',   
        },
        cyber: {
          cyan: '#00F0FF',
          blue: '#0A3B59',
          glow: 'rgba(0, 240, 255, 0.5)'
        },
        luxury: {
          gold: '#D4AF37',
          light: '#F5D061',
          dark: '#8B7324'
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.4), 0 0 20px rgba(0, 240, 255, 0.2)',
        'neon-gold': '0 0 10px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.2)',
        'cyber-card': 'inset 0 0 30px rgba(0,0,0,0.8), 0 20px 40px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(to right, #1F1F1F 1px, transparent 1px), linear-gradient(to bottom, #1F1F1F 1px, transparent 1px)`,
      },
      animation: {
        'scanline': 'scanline 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1.2)' },
          '50%': { opacity: .7, filter: 'brightness(0.8)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px) translateZ(0)' },
          '100%': { opacity: 1, transform: 'translateY(0) translateZ(0)' },
        }
      },
    },
  },
  plugins: [],
}
