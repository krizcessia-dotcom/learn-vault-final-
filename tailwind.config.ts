import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "lv-dark-green": "#1A3E25",
        "lv-medium-green": "#2D5C39",
        "lv-forest": "#2E4730",
        "lv-pastel-green": "#C0E8C7",
        "lv-pale-green": "#E4F0E4",
        "lv-lime": "#32CD32",
        "lv-accent-yellow": "#FDD835",
        "lv-purple": "#800080",
        "lv-pink": "#FFC0CB",
        "lv-card-purple": "#E8D0E8",
        "lv-section-purple": "#F0E0F0",
      },
      fontFamily: {
        display: ["var(--font-press-start)", "monospace"],
        serif: ["Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
