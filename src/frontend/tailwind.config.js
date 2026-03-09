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
        // HalfBuilt Obsidian Glass — exact hex tokens
        "electric-indigo": "#4F46E5",
        "cyber-mint": "#10B981",
        "obsidian-void": "#050505",
        "glass-base": "rgba(10, 10, 11, 0.7)",
        "text-crisp": "#F3F4F6",
        "text-dim": "#9CA3AF",
        // Extended indigo scale
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.03em",
        tight: "-0.02em",   // high-end heading default
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        // Obsidian Glass elevation
        "glass": "0 8px 32px 0 rgba(0,0,0,0.8)",
        "glass-lg": "0 16px 48px 0 rgba(0,0,0,0.9)",
        // Electric Indigo glows
        "indigo-glow": "0 0 20px rgba(79,70,229,0.2)",
        "indigo-glow-md": "0 0 30px rgba(79,70,229,0.35)",
        "indigo-glow-lg": "0 0 40px rgba(79,70,229,0.5)",
        "indigo-glow-sm": "0 0 10px rgba(79,70,229,0.15)",
        // Cyber Mint glow
        "mint-glow": "0 0 16px rgba(16,185,129,0.25)",
        "mint-glow-lg": "0 0 30px rgba(16,185,129,0.4)",
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
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        // Obsidian Breathing — Electric Indigo
        "glow-pulse": {
          "0%":   { boxShadow: "0 0 5px rgba(79, 70, 229, 0.2)" },
          "50%":  { boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)" },
          "100%": { boxShadow: "0 0 5px rgba(79, 70, 229, 0.2)" },
        },
        // Mint breathing for 'Invested' alerts
        "mint-pulse": {
          "0%":   { boxShadow: "0 0 5px rgba(16, 185, 129, 0.2)" },
          "50%":  { boxShadow: "0 0 16px rgba(16, 185, 129, 0.5)" },
          "100%": { boxShadow: "0 0 5px rgba(16, 185, 129, 0.2)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "mint-pulse": "mint-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
