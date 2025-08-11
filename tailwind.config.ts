import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Enables toggling dark mode with a class
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
