import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        moss: "#627864",
        leaf: "#2f7d5d",
        coral: "#d7654f",
        marigold: "#f2b84b",
        cloud: "#f7f7f2"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(23, 32, 27, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
