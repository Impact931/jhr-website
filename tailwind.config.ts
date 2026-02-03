import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // JHR Brand Colors - Dark Mode Primary
        jhr: {
          black: "#0A0A0A",
          "black-light": "#1A1A1A",
          "black-lighter": "#2A2A2A",
          white: "#FFFFFF",
          "white-muted": "#E5E5E5",
          "white-dim": "#A3A3A3",
          // Light section colors
          light: "#F9FAFB",
          "light-card": "#FFFFFF",
          "light-border": "#E5E7EB",
          "light-text": "#374151",
          "light-text-muted": "#6B7280",
          // Gold accent - warmth, trust, premium
          gold: {
            DEFAULT: "#C9A227",
            light: "#D4B94A",
            dark: "#A68920",
            muted: "#8B7355",
          },
          // Blue accent - professionalism, calm, reliability
          blue: {
            DEFAULT: "#2563EB",
            light: "#3B82F6",
            dark: "#1D4ED8",
            muted: "#1E3A5F",
          },
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-sm": ["2rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
      },
      spacing: {
        "section-y": "6rem",
        "section-y-lg": "8rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-gold": "linear-gradient(135deg, #C9A227 0%, #D4B94A 50%, #A68920 100%)",
        "gradient-dark": "linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
