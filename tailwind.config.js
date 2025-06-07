/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/adapters/**/*.{js,ts,jsx,tsx}',
    './src/core/**/*.{js,ts,jsx,tsx}',
    './node_modules/bro-toastify/**/*.{js,ts,jsx,tsx}', // For local testing
  ],
  safelist: [
    // Safelist position classes
    'top-4', 'right-4', 'items-end',
    'left-4', 'items-start',
    'bottom-4',
    'left-1/2', '-translate-x-1/2', 'items-center',
    // Safelist type classes
    'bg-white/80', 'backdrop-blur-md', 'border', 'border-gray-200', 'text-gray-900',
    'bg-green-500/90', 'border-green-600', 'text-white',
    'bg-red-500/90', 'border-red-600',
    'bg-blue-500/90', 'border-blue-600',
    'bg-yellow-500/90', 'border-yellow-600',
    // Safelist toast container classes
    'min-w-[300px]', 'max-w-[500px]', 'p-4', 'rounded-xl', 'shadow-md', 'flex', 'flex-col', 'opacity-100',
    'transition-all', 'duration-300', 'hover:scale-105', 'hover:shadow-lg',
    // Safelist loading spinner classes
    'border-4', 'border-gray-200', 'border-t-blue-500', 'rounded-full', 'w-5', 'h-5', 'animate-spin',
    'text-sm', 'animate-[fade_0.3s_ease-in-out]',
    // Safelist dismiss button classes
    'absolute', 'top-2', 'right-2', 'w-6', 'h-6', 'flex', 'items-center', 'justify-center',
    'rounded-full', 'bg-gray-200/50', 'text-gray-600', 'font-semibold',
    'hover:bg-gray-300/70', 'hover:text-gray-900', 'transition-all', 'duration-200',
    // Safelist title classes
    'font-semibold', 'text-base', 'mb-1.5', 'tracking-tight',
  ],
  theme: {
    extend: {
      keyframes: {
        fade: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        topSlide: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        topSlideReverse: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(-100%)', opacity: 0 },
        },
        rightSlide: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        rightSlideReverse: {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(100%)', opacity: 0 },
        },
        bottomSlide: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        bottomSlideReverse: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(100%)', opacity: 0 },
        },
        leftSlide: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        leftSlideReverse: {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(-100%)', opacity: 0 },
        },
        zoom: {
          '0%': { transform: 'scale(0.5)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        flip: {
          '0%': { transform: 'perspective(400px) rotateY(90deg)', opacity: 0 },
          '100%': { transform: 'perspective(400px) rotateY(0deg)', opacity: 1 },
        },
        bounce: {
          '0%': { transform: 'translateY(0)', opacity: 0 },
          '50%': { transform: 'translateY(-20px)', opacity: 0.8 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        fade: 'fade 0.3s ease-in-out',
        topSlide: 'topSlide 0.3s ease-in-out',
        topSlideReverse: 'topSlideReverse 0.3s ease-in-out',
        rightSlide: 'rightSlide 0.3s ease-in-out',
        rightSlideReverse: 'rightSlideReverse 0.3s ease-in-out',
        bottomSlide: 'bottomSlide 0.3s ease-in-out',
        bottomSlideReverse: 'bottomSlideReverse 0.3s ease-in-out',
        leftSlide: 'leftSlide 0.3s ease-in-out',
        leftSlideReverse: 'leftSlideReverse 0.3s ease-in-out',
        zoom: 'zoom 0.3s ease-in-out',
        flip: 'flip 0.3s ease-in-out',
        bounce: 'bounce 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};