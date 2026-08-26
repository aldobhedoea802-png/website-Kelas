/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // === SISVOR 009 design tokens ===
      // Concept: a class roster / student ID ledger. Ink navy stands in for the
      // ledger page, gold marks achievement (portfolio, highlights), teal marks
      // information (data, links, stats), coral is used sparingly for emphasis.
      colors: {
        ink: {
          50: "#EEF1F7",
          100: "#DCE2EE",
          200: "#B3BFD6",
          300: "#8A9BBE",
          400: "#5A6C93",
          500: "#3B4A6B",
          600: "#283654",
          700: "#1C2740",
          800: "#141C2F",
          900: "#0E1626",
          950: "#0A1020",
        },
        gold: {
          50: "#FBF4E4",
          100: "#F6E7C4",
          200: "#EFD497",
          300: "#E7C069",
          400: "#DFAD48",
          500: "#D6A756",
          600: "#BD8A34",
          700: "#966C29",
          800: "#6F4F1E",
          900: "#4A3414",
        },
        teal: {
          50: "#E9F4F3",
          100: "#CBE5E3",
          200: "#98CCC8",
          300: "#6FC3BD",
          400: "#3E9C96",
          500: "#256E6A",
          600: "#1D5B58",
          700: "#164846",
          800: "#0F3433",
          900: "#0A2423",
        },
        coral: {
          300: "#F4A997",
          400: "#EE8A73",
          500: "#E8735A",
          600: "#D45A40",
          700: "#B0442F",
        },
        paper: {
          DEFAULT: "#F6F1E7",
          100: "#FBF8F2",
          200: "#EFE8D8",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["\"Plus Jakarta Sans\"", "system-ui", "sans-serif"],
        mono: ["\"JetBrains Mono\"", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,16,32,0.06), 0 8px 24px -8px rgba(10,16,32,0.35)",
        "card-hover": "0 4px 12px rgba(10,16,32,0.12), 0 24px 48px -16px rgba(10,16,32,0.45)",
        gold: "0 8px 24px -8px rgba(214,167,86,0.45)",
      },
      backgroundImage: {
        "ledger-grid":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        ledger: "36px 36px",
      },
    },
  },
  plugins: [],
}