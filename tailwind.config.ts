import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          pink: '#fce4ec',
          peach: '#fff3e0',
          mint: '#e0f2f1',
          sky: '#e3f2fd',
          lavender: '#ede7f6',
        },
      },
      borderRadius: {
        'clay': '24px',
        'clay-lg': '32px',
      },
      boxShadow: {
        'clay': '8px 8px 16px rgba(0,0,0,0.08), -4px -4px 12px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)',
        'clay-sm': '4px 4px 8px rgba(0,0,0,0.06), -2px -2px 6px rgba(255,255,255,0.7), inset 1px 1px 1px rgba(255,255,255,0.5)',
        'clay-pressed': 'inset 4px 4px 8px rgba(0,0,0,0.08), inset -2px -2px 6px rgba(255,255,255,0.6)',
        'clay-hover': '10px 10px 20px rgba(0,0,0,0.1), -5px -5px 15px rgba(255,255,255,0.9), inset 1px 1px 2px rgba(255,255,255,0.7)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-soft': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
