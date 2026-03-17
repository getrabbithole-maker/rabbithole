import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'rh-bg': '#060608',
        'rh-surf': '#0D0D12',
        'rh-acc': '#7B4FBE',
        'rh-acc-soft': '#B47FE8',
        'rh-acc-dim': 'rgba(123, 79, 190, 0.15)',
        'rh-rest': '#4EC994',
        'rh-rest-dim': 'rgba(78, 201, 148, 0.15)',
        'rh-t1': '#F0EDF9',
        'rh-t2': 'rgba(240, 237, 249, 0.5)',
        'rh-t3': 'rgba(240, 237, 249, 0.25)',
        'rh-border': 'rgba(255, 255, 255, 0.06)',
        'rh-border-acc': 'rgba(180, 127, 232, 0.25)',
      },
      fontFamily: {
        'display': ['var(--font-syne)', 'sans-serif'],
        'body': ['var(--font-inter)', 'var(--font-sarabun)', 'sans-serif'],
        'mono': ['var(--font-mono)', 'monospace'],
        'thai': ['var(--font-sarabun)', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 1%)' },
          '30%': { transform: 'translate(-1%, 4%)' },
          '40%': { transform: 'translate(4%, -2%)' },
          '50%': { transform: 'translate(-3%, 2%)' },
          '60%': { transform: 'translate(2%, -4%)' },
          '70%': { transform: 'translate(-4%, 1%)' },
          '80%': { transform: 'translate(1%, 3%)' },
          '90%': { transform: 'translate(-2%, -1%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
