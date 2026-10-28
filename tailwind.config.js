/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#7A1F2B",
          50: "#FAF0F1",
          100: "#F5DFE2",
          200: "#EABFC5",
          700: "#6B1B26",
          800: "#57161F",
          900: "#441118",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E3C275",
          dark: "#A38235",
          50: "#FDFBF5",
        },
        ivory: {
          DEFAULT: "#FBF7EF",
          card: "#FFFFFF",
          subtle: "#F5EFE1",
        },
        charcoal: {
          DEFAULT: "#222222",
          muted: "#555555",
          light: "#777777",
        },
        forest: {
          DEFAULT: "#1E7B4A",
          dark: "#165D37",
          50: "#ECF8F1",
        },
        decline: {
          DEFAULT: "#6B6B6B",
          dark: "#4F4F4F",
          50: "#F2F2F2",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
