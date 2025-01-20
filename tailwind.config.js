/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "serif"],
      },
      spacing: {
        15: "60px",
        20: "80px",
        28: "110px",
      },
      fontSize: {
        "3xl": "30px",
        "4xl": "45px",
        "5xl": "60px",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
