/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: { 
      colors: {
        'tr-sun': '#FFD700',
        'tr-orange': '#FF8C00',
        'tr-pink' : '#FF1493',
        'tr-ocean' : '#00BFFF',
        'tr-palm': '#32CD32'
      },
       //Criamos a animação aqui para não precisar do SASS para isso
       animation: {
         'tropical-wave': 'tr-color-wave 8s ease-in-out infinite',
       },
       keyframes: {
         'tr-color-wave': {
            '0%, 100%': {'background-position': '0% 50%' },
            '50%': { 'background-position': '0% 50%' },
         },
       },
     },
   },
   plugins: [],
 }