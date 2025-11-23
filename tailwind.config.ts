import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#3DCD58", // Schneider Electric green
                "background-light": "#F0F4F8", // Light grey
                "background-dark": "#18191a", // Dark grey
                "surface-light": "rgba(255, 255, 255, 0.95)",
                "surface-dark": "rgba(40, 41, 42, 0.9)",
                "border-light": "rgba(0, 0, 0, 0.1)",
                "border-dark": "rgba(255, 255, 255, 0.2)",
                "text-primary-light": "#111827",
                "text-primary-dark": "#e4e6eb",
                "text-secondary-light": "#4B5563",
                "text-secondary-dark": "#b0b3b8",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "16px",
            },
            boxShadow: {
                'glass': '0 4px 16px 0 rgba(0, 0, 0, 0.05)',
            },
        },
    },
    plugins: [
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("tailwindcss-animate"),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("@tailwindcss/typography"),
    ],
};
export default config;
