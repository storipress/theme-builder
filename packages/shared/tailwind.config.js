const clearBlue = '#2b8bf2'

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  presets: [require('./tailwind.config.base')],
  content: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx', './src/**/*.tsx'],
  theme: {
    height: (theme) => ({ ...theme('width'), screen: '100vh', half: '50vh' }),
    extend: {
      zIndex: {
        '-1': '-1',
        tooltip: '5000',
        popup: '2000',
        mask: '1000',
        dialog: '500',
        menu: '100',
      },
      // builder button
      scale: {
        200: '2',
      },
      colors: {
        'almost-black': '#191919',
        black: '#191919',
        'black-three': '#272727',
        'black-two': '#2a2a2a',
        'bright-blue': '#116dff',
        'brown-grey': '#898989',
        'brownish-grey': '#5a5a5a',
        'charcoal-grey': '#485353',
        'charcoal-grey-dark': '#2d373b',
        'clear-blue': '#2b8bf2',
        'clear-blue-20': 'rgba(43, 139, 242, 0.2)',
        'cool-grey': '#afb6bb',
        current: 'currentColor',
        'dark-indigo': '#0a2542',
        'darker-indigo': '#071d34',
        grapefruit: '#fc675b',
        'grassy-green': '#44a604',
        'greyish-brown': '#3d3d3d',
        'ice-blue': '#ecf0f6',
        'light-grey-blue': '#b0b6bb',
        'light-pale-grey': '#f1f3f4',
        'light-periwinkle': '#d2e0f6',
        mango: '#ffa324',
        'medium-blue': '#306cae',
        pale: '#fff2d4',
        'pale-grey': '#f1f7ff',
        'pale-grey-two': '#f5f8fb',
        'pale-salmon': '#ffbd98',
        'pinkish-orange': '#ff6c40',
        salmon: '#ff8f6d',
        sand: '#e9c97a',
        silver: '#d2e0e0',
        'sun-yellow': '#fcc934',
        'very-light-pink': '#e3e3e3',
        'warm-grey': '#979797',
        white: '#ffffff',
        'white-grey': '#f2f2f2',
        'white-two': '#f8f8f8',
      },
      opacity: {
        5: '0.05',
        10: '0.1',
        15: '0.15',
        20: '0.2',
        24: '0.24',
        33: '0.33',
        // block preview
        40: '0.4',
        70: '0.7',
        80: '0.80',
      },
      spacing: {
        // for menu
        '2px': '2px',
        25: '6.25rem',

        // subscribe
        128: '32rem',

        // article
        192: '48rem',
        256: '64rem',
      },
      // hover & active outline
      boxShadow: {
        hover: `0 0 0 1px ${clearBlue}`,
        active: `0 0 0 2px ${clearBlue}`,

        // shadow style guide
        1: '0 2px 5px 2px rgba(0, 0, 0, 0.1)',
        2: '5px 10px 30px 0 rgba(0, 0, 0, 0.15)',
        3: '10px 25px 60px 0 rgba(0, 0, 0, 0.3)',

        // white variant for editor
        w2: '5px 10px 30px 0 rgba(255, 255, 255, 0.30)',
      },
      screens: {
        // to match builder blocks config
        lg: '1070px',

        // 13' screen size
        '2xl': '1680px',
      },

      // other page preview
      width: {
        fit: 'fit-content',
      },

      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },

      transitionDuration: {
        50: '50ms',
      },

      // add block transition
      transitionDelay: {
        0: '0ms',
      },

      // add block transition
      transitionTimingFunction: {
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/typography'),
  ],
}
