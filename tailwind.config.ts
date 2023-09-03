import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      'Gunmetal': '#253237',
      'Charcoal': '#334146',
      'OuterSpace': '#414F55',
      'PayneGray': '#4F5D64',
      'PaynesGray': '#5C6B73',
      'CadetGray': '#7D909A',
      'CadetsGray': '#9DB4C0',
      'LightGray': '#C2DFE3',
      'LightCyan': '#E0FBFC',
      green: {
        'CambridgeBlue':'#9DBF9F'
      },
      red: {
        'Wenge': '#735C5C'
      }
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
