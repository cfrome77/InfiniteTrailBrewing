import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#1A4132",
        tan: "#E8D7B5",
        sky: "#7BA3B8",
        cream: "#F5F0E6",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        serif: ["var(--font-oswald)", "Oswald", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
