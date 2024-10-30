/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-blue-500',
    'bg-red-500',
    'bg-lime-500',
    'bg-purple-500',
    'bg-lime-500',
    'bg-orange-500',
    'bg-green-500',
    'bg-fuchsia-500',
    'bg-indigo-500',

    'border-blue-500',
    'border-red-500',
    'border-lime-500',
    'border-purple-500',
    'border-lime-500',
    'border-orange-500',
    'border-green-500',
    'border-fuchsia-500',
    'border-indigo-500',
  ],
  theme: {
    extend: {
      animation: {
        move: 'move 5s linear infinite',
        spinslow: 'spin 2s linear infinite both',
        slidin: 'slide 350ms linear forwards',
      },
      keyframes: {
        move: {
          '0%': { transform: 'translateX(-200px)' },
          '100%': { transform: 'translateX(200px)' },
        },
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}
