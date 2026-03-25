/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A4B8C',
          dark:    '#0F2E57',
          light:   '#2A5FA8',
        },
        vivid:      '#2196F3',
        pale:       '#E8F0FE',
        'mid-blue': '#BDD7F5',
        success: {
          DEFAULT: '#2E7D32',
          light:   '#E8F5E9',
        },
        warning: {
          DEFAULT: '#F57C00',
          light:   '#FFF3E0',
        },
        slate:  '#455A64',
        muted:  '#6B7A8D',
        border: '#DDEAF6',
        'app-bg': '#F5F7FA',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { pill: '100px' },
      boxShadow: {
        card:  '0 4px 24px rgba(26,75,140,0.08)',
        float: '0 20px 60px rgba(26,75,140,0.14)',
        vivid: '0 4px 20px rgba(33,150,243,0.4)',
      },
      animation: {
        marquee:    'marquee 22s linear infinite',
        pip:        'pip 2.2s ease-in-out infinite',
        'fade-up':  'fadeUp 0.7s ease both',
        'spin-slow':'spin 50s linear infinite',
      },
      keyframes: {
        marquee: { from:{transform:'translateX(0)'}, to:{transform:'translateX(-50%)'} },
        pip:     { '0%,100%':{transform:'scale(1)',opacity:'1'}, '50%':{transform:'scale(1.5)',opacity:'0.5'} },
        fadeUp:  { from:{opacity:'0',transform:'translateY(22px)'}, to:{opacity:'1',transform:'translateY(0)'} },
      },
    },
  },
  plugins: [],
}
