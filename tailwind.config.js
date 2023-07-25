const BLACK = "#2E2925";
const NANDOR = "#4F504F";
const GRAY = "#A3A9AC";
const GRAY_PRESSED = "#B5B5B5";
const GRAY_HOVER = "#F2F2F2";
const LIGHT_GRAY = "#E3E3E3";
const SOFT_GRAY = "#F9F9F9";
const WHITE = "#FFF";
const GREEN = "#049818";
const RED = "#F31229";
const YELLOW = "#FFBF3B";
const YELLOW_HOVER = "#FFE27A";
const BORDER_YELLOW = "#EEA53F";
const YELLOW_PRESSED = "#DB900F";
const SUCCESS_BACKGROUND = "#AED581";
const SUCCESS_TEXT = "#1B5E20";
const WARNING_BACKGROUND = "#FFF176";
const WARNING_TEXT = "#F57F17";
const DANGER_BACKGROUND = "#FF8A65";
const DANGER_TEXT = "#AF0101";
const BLUE = "#1E88E5";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        bold: ["Poppins-Bold", "sans-serif"],
        thin: ["Poppins-Thin", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        black: BLACK,
        gray: GRAY,
        "gray-hover": GRAY_HOVER,
        "gray-pressed": GRAY_PRESSED,
        "light-gray": LIGHT_GRAY,
        "soft-gray": SOFT_GRAY,
        white: WHITE,
        green: GREEN,
        red: RED,
        nandor: NANDOR,
        yellow: YELLOW,
        "yellow-hover": YELLOW_HOVER,
        "border-yellow": BORDER_YELLOW,
        "yellow-pressed": YELLOW_PRESSED,
        "success-background": SUCCESS_BACKGROUND,
        success: SUCCESS_TEXT,
        "warning-background": WARNING_BACKGROUND,
        warning: WARNING_TEXT,
        "danger-background": DANGER_BACKGROUND,
        danger: DANGER_TEXT,
        blue: BLUE,
      },
    },
  },
  plugins: [],
};
