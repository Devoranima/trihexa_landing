/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'th-red':   '#A80000',
        'th-navy':  '#1B263B',
        'th-dark':  '#1A1A1B',
        'th-light': '#F4F4F4',
        'th-white': '#FFFFFF',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"Inter"',      'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.35em',
      },
    },
  },
  plugins: [],
};
