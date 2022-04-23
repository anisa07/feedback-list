module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'white': '#ffffff',
        'darkgrayblue': '#383E68',
        'darkgray': '#686C7F',
        'bluegray': '#CDD2EF',
        'lightbluegray': '#F3F4FF',
        'blue': '#002CBB',
        'darkblue': '#0B145D',
        'lightblue': '#44A8F1',
        'violet': '#7C5CF4',
        'fuchsia': '#AE1FEB',
        'raspberry': '#C749B4',
        'salmon': '#E77686'
      },
    }
    // screens: {
    //   'sm': '640px',
    //   // => @media (min-width: 640px) { ... }
    //
    //   'md': '768px',
    //   // => @media (min-width: 768px) { ... }
    //
    //   'lg': '1024px',
    //   // => @media (min-width: 1024px) { ... }
    //
    //   'xl': '1280px',
    //   // => @media (min-width: 1280px) { ... }
    //
    //   '2xl': '1536px',
    //   // => @media (min-width: 1536px) { ... }
    // }
  },
  plugins: [],
}
