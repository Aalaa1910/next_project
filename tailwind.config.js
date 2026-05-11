/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#6c63ff",
          hover: "#7c74ff",
        },
        surface: {
          DEFAULT: "#ffffff",
          card: "#f8fafc",
          hover: "#eef2ff",
        },
        border: "#e5e7eb",
      },
    },
  },
  plugins: [],
};
