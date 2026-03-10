import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f6efe4",
        clay: "#b1673d",
        dusk: "#12343b",
        ember: "#d94f2b",
        oasis: "#2f7d6b",
      },
    },
  },
  plugins: [],
};

export default config;
