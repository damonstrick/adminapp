import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: {
          primary: '#121313',
          secondary: '#4b595c',
          tertiary: '#6e8081',
          quarternary: '#89989b',
          white: '#ffffff',
        },
        surface: {
          'bg-white': '#ffffff',
        },
        stroke: {
          light: '#e3e7ea',
        },
        main: {
          primary: '#16696d',
          hover: '#0d5256',
          pressed: '#02363d',
        },
        secondary: {
          'lighten-8': '#f7f8f8',
          'lighten-7': '#f0f2f2',
        },
        primary: {
          'darken-7': '#01262b',
          'darken-6': '#02363d',
        },
        dataviz: {
          'dataviz-1': '#36c5ba',
          'dataviz-6': '#7c8af4',
        },
      },
      fontSize: {
        'text-small': ['11px', { lineHeight: '16px', letterSpacing: '0.11px' }],
        'text': ['12px', { lineHeight: '16px', letterSpacing: '0.12px' }],
        'text-large': ['14px', { lineHeight: '20px', letterSpacing: '0.14px' }],
        'h3': ['14px', { lineHeight: '20px', letterSpacing: '0.14px' }],
        'h2': ['16px', { lineHeight: '24px', letterSpacing: '0.16px' }],
      },
      spacing: {
        'gap-xs': '2px',
        'gap-s': '4px',
        'gap-m': '8px',
        'gap-l': '12px',
        'gap-xl': '16px',
        'gap-xxl': '24px',
        'padding-zero': '0px',
        'padding-xs': '2px',
        'padding-s': '4px',
        'padding-m': '8px',
        'padding-l': '12px',
        'padding-xl': '16px',
      },
      borderRadius: {
        'corner-radius-m': '4px',
        'corner-radius-l': '8px',
        'corner-radius-round': '9999px',
      },
    },
  },
  plugins: [],
};
export default config;
