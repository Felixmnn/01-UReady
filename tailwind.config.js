/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./context/**/*.{js,jsx,ts,tsx}","./lib/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}","./functions/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}