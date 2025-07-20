import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-green": "#4ba124",
        "brand-cream": "#e5eadf",
        "brand-text": "#0d0d0d",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;