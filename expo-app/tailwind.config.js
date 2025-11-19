module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        rise: {
          DEFAULT: '#FEDADA',
          light: '#FEEFEF',
          status: '#FC8888'
        },
        drop: {
          DEFAULT: '#DAEDF7',
          light: '#EAF5FE',
          status: '#6DB3E0'
        }
      },
      fontFamily: {
        inter: ['Inter']
      }
    }
  },
  plugins: []
}
