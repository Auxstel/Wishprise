/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**",
    "!./dist/**",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        hand: ['Dancing Script', 'cursive'],
      },
      colors: {
        magical: {
          50: '#FDF4FF', 100: '#FAE8FF', 200: '#F5D0FE', 300: '#F0ABFC',
          400: '#E879F9', 500: '#D946EF', 600: '#C026D3', 700: '#A21CAF',
          800: '#86198F', 900: '#701A75',
        },
        gold: '#FFD700',
        border: "hsl(240 3.7% 15.9%)",
        input: "hsl(240 3.7% 15.9%)",
        ring: "hsl(263 70% 50%)",
        background: "hsl(240 10% 3.9%)",
        foreground: "hsl(0 0% 98%)",
        primary: {
          DEFAULT: "hsl(263 70% 50%)",
          foreground: "hsl(0 0% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(240 3.7% 15.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0 62.8% 30.6%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(240 3.7% 15.9%)",
          foreground: "hsl(240 5% 64.9%)",
        },
        accent: {
          DEFAULT: "hsl(240 3.7% 15.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        popover: {
          DEFAULT: "hsl(240 10% 3.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        card: {
          DEFAULT: "hsl(240 10% 3.9%)",
          foreground: "hsl(0 0% 98%)",
        },
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0) scale(1)' }, '50%': { transform: 'translateY(-20px) scale(1.05)' } },
        'bounce-subtle': { '0%, 100%': { transform: 'translateY(-5%)' }, '50%': { transform: 'translateY(0)' } },
        twinkle: { '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' }, '50%': { opacity: 1, transform: 'scale(1.2)' } },
        blob: { '0%': { transform: 'translate(0px) scale(1)' }, '33%': { transform: 'translate(30px) scale(1.1)' }, '66%': { transform: 'translate(-20px) scale(0.9)' }, '100%': { transform: 'translate(0px) scale(1)' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } }
      }
    },
  },
  plugins: [],
}
