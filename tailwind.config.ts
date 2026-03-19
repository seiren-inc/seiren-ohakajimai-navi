import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

const config = {
    darkMode: "class",
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './registry/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
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
                sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
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
                // 2026: Shimmer — スケルトンローディング・プレミアム感演出
                shimmer: {
                    "0%":   { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                // 2026: Floating — 要素の浮遊感（清蓮向け・緩やか）
                floating: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%":      { transform: "translateY(-10px)" },
                },
                // 2026: FloatingSlow — 背景・装飾要素向けの超緩やか浮遊
                "floating-slow": {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "33%":      { transform: "translateY(-6px) rotate(0.5deg)" },
                    "66%":      { transform: "translateY(-3px) rotate(-0.3deg)" },
                },
                // 2026: PulseGlow — グロー効果（清蓮向け：水の輝き）
                "pulse-glow": {
                    "0%, 100%": { opacity: "0.6", filter: "blur(12px)" },
                    "50%":      { opacity: "1",   filter: "blur(8px)" },
                },
            },
            animation: {
                "accordion-down":  "accordion-down 0.2s ease-out",
                "accordion-up":    "accordion-up 0.2s ease-out",
                // Shimmer: スケルトンUI・ボタンのシマー効果
                shimmer:           "shimmer 2.0s linear infinite",
                // Floating: アイコン・カード・装飾要素の浮遊
                floating:          "floating 4.0s ease-in-out infinite",
                "floating-slow":   "floating-slow 8.0s ease-in-out infinite",
                // Glow: 清蓮ブランドの水の輝き演出
                "pulse-glow":      "pulse-glow 3.0s ease-in-out infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
