export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0EB',
        warm: '#ECE4D9',
        stone: '#E5DDD3',
        ink: '#2D2A26',
        muted: '#8B8580',
        gold: '#D4A574',
        'gold-light': '#E8C99B',
        leaf: '#7A9E7E',
        sky: '#8BB8D0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
