import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        ink: "#04060c",
        panel: "#09101f",
        // One family of blues, taken from the wizard's robe: deep navy to ice.
        navy: "#0b1630",
        volt: "#2f6bff",
        azure: "#5aa9ff",
        ice: { DEFAULT: "#cfe6ff", deep: "#9cc8ff" },
        // Older names still used in a few places map onto the same blues.
        moon: { DEFAULT: "#8fd3ff", soft: "#cfe6ff", deep: "#2b6cb0" },
      },
      maxWidth: { content: "72rem" },
      keyframes: {
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "none" } },
        orbit: { to: { transform: "rotate(360deg)" } },
        draw: { from: { strokeDashoffset: "1" }, to: { strokeDashoffset: "0" } },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        orbit: "orbit 2.4s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
