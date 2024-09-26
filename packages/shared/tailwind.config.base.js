/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
  theme: {
    extend: {
      screens: {
        // to match builder blocks config
        lg: '1070px',
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}

module.exports = config
