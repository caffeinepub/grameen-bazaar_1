import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        // Semantic colors for Grameen Bazaar
        saffron: {
          50: "oklch(0.97 0.04 70)",
          100: "oklch(0.94 0.08 65)",
          200: "oklch(0.88 0.12 60)",
          300: "oklch(0.82 0.16 55)",
          400: "oklch(0.75 0.18 52)",
          500: "oklch(0.68 0.18 50)",
          600: "oklch(0.62 0.18 50)",
          700: "oklch(0.52 0.16 45)",
          800: "oklch(0.42 0.12 40)",
          900: "oklch(0.32 0.08 38)",
        },
        forest: {
          50: "oklch(0.97 0.03 140)",
          100: "oklch(0.92 0.06 140)",
          500: "oklch(0.52 0.14 145)",
          600: "oklch(0.45 0.12 145)",
          700: "oklch(0.38 0.09 145)",
          800: "oklch(0.3 0.07 145)",
        },
        terra: {
          50: "oklch(0.97 0.03 55)",
          100: "oklch(0.93 0.06 52)",
          400: "oklch(0.78 0.13 45)",
          500: "oklch(0.72 0.13 42)",
          600: "oklch(0.65 0.12 40)",
          700: "oklch(0.55 0.1 38)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 oklch(0.22 0.04 45 / 0.06)",
        sm: "0 2px 8px 0 oklch(0.22 0.04 45 / 0.08)",
        md: "0 4px 16px 0 oklch(0.22 0.04 45 / 0.1)",
        lg: "0 8px 24px 0 oklch(0.22 0.04 45 / 0.12)",
        xl: "0 12px 40px 0 oklch(0.22 0.04 45 / 0.15)",
        "glow-amber": "0 0 20px oklch(0.72 0.18 52 / 0.35)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
