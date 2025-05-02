/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        topSlide: {
          "0%": { transform: "translateY(-100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        topSlideReverse: {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "100%": { transform: "translateY(-100%)", opacity: 0 },
        },
        rightSlide: {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        rightSlideReverse: {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(100%)", opacity: 0 },
        },
        bottomSlide: {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        bottomSlideReverse: {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "100%": { transform: "translateY(100%)", opacity: 0 },
        },
        leftSlide: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        leftSlideReverse: {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(-100%)", opacity: 0 },
        },
        zoom: {
          "0%": { transform: "scale(0.5)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        flip: {
          "0%": { transform: "perspective(400px) rotateY(90deg)", opacity: 0 },
          "100%": { transform: "perspective(400px) rotateY(0deg)", opacity: 1 },
        },
        bounce: {
          "0%": { transform: "translateY(0)", opacity: 0 },
          "50%": { transform: "translateY(-20px)", opacity: 0.8 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        fade: "fade 0.3s ease-in-out",
        topSlide: "topSlide 0.3s ease-in-out",
        topSlideReverse: "topSlideReverse 0.3s ease-in-out",
        rightSlide: "rightSlide 0.3s ease-in-out",
        rightSlideReverse: "rightSlideReverse 0.3s ease-in-out",
        bottomSlide: "bottomSlide 0.3s ease-in-out",
        bottomSlideReverse: "bottomSlideReverse 0.3s ease-in-out",
        leftSlide: "leftSlide 0.3s ease-in-out",
        leftSlideReverse: "leftSlideReverse 0.3s ease-in-out",
        zoom: "zoom 0.3s ease-in-out",
        flip: "flip 0.3s ease-in-out",
        bounce: "bounce 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};