// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./app/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F1DE",
        foreground: "#B0BA99",
        accent: "#4E220F",
        border: "#9D6638",
        walnut: "#4E220F",
        terracotta: "#9D6638",
        sage: "#B0BA99",
        cardbg: "#FCF8EC",
        gold: "#9D6638",
        "gold-hover": "#4E220F",
      },
      // You can add additional extensions here (e.g., fontFamily)
    }
  },
  plugins: []
};
