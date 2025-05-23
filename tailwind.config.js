// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        coral: "#FF715B",
        mint: "#8EE4AF",
        cream: "#FDFBF9",
        graphite: "#2B2B2B",
        "soft-gray": "#DADADA",
      },
    },
  },
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
};
