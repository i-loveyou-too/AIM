import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        soft: "#F7F7F8",
        brand: "#F04452",
        accent: "#FF7A59",
        warm: "#FFE44D",
        text: "#1F1F23",
        muted: "#6B6B76",
        border: "#E9E9EE",
      },
      boxShadow: {
        soft: "0 18px 40px rgba(31, 31, 35, 0.06)",
        glow: "0 22px 50px rgba(240, 68, 82, 0.12)",
      },
      backgroundImage: {
        "clean-dots":
          "radial-gradient(circle at top left, rgba(240,68,82,0.08), transparent 28%), radial-gradient(circle at top right, rgba(255,228,77,0.14), transparent 26%), radial-gradient(circle at bottom right, rgba(255,122,89,0.10), transparent 24%)",
      },
      fontFamily: {
        sans: [
          "Noto Sans KR",
          "Apple SD Gothic Neo",
          "system-ui",
          "sans-serif",
        ],
        serif: ["Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
