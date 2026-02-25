// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // Fresh Green Palette
//         fresh: {
//           50: '#f0fdf4',
//           100: '#dcfce7',
//           200: '#bbf7d0',
//           300: '#86efac',
//           400: '#4ade80',
//           500: '#22c55e',
//           600: '#16a34a',
//           700: '#15803d',
//           800: '#166534',
//           900: '#14532d',
//         },
//         // Organic Earth Tones
//         earth: {
//           50: '#fafaf9',
//           100: '#f5f5f4',
//           200: '#e7e5e4',
//           300: '#d6d3d1',
//           400: '#a8a29e',
//           500: '#78716c',
//           600: '#57534e',
//           700: '#44403c',
//           800: '#292524',
//           900: '#1c1917',
//         },
//         // Accent colors
//         tangerine: '#ff6b35',
//         sunshine: '#ffd23f',
//         ocean: '#0077b6',
//       },
//       fontFamily: {
//         display: ['"Fraunces"', 'serif'], // Display font cho headers
//         body: ['"DM Sans"', 'sans-serif'], // Body font cho text
//         mono: ['"JetBrains Mono"', 'monospace'],
//       },
//       animation: {
//         'float': 'float 3s ease-in-out infinite',
//         'fade-in': 'fadeIn 0.5s ease-out',
//         'slide-up': 'slideUp 0.5s ease-out',
//         'slide-in-right': 'slideInRight 0.3s ease-out',
//         'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         'typing': 'typing 1s steps(20) forwards',
//       },
//       keyframes: {
//         float: {
//           '0%, 100%': { transform: 'translateY(0px)' },
//           '50%': { transform: 'translateY(-10px)' },
//         },
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         slideUp: {
//           '0%': { transform: 'translateY(20px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//         slideInRight: {
//           '0%': { transform: 'translateX(100%)', opacity: '0' },
//           '100%': { transform: 'translateX(0)', opacity: '1' },
//         },
//         typing: {
//           '0%': { width: '0' },
//           '100%': { width: '100%' },
//         },
//       },
//       boxShadow: {
//         'organic': '0 4px 20px rgba(34, 197, 94, 0.1)',
//         'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
//         'lift': '0 8px 30px rgba(0, 0, 0, 0.12)',
//       },
//       backgroundImage: {
//         'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
//         'organic-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556 15.858 12.14 28 0zm-6.858 0l.707.707 7.778 7.778 1.414-1.414L25.172 0h-.03zm13.716 0l-1.414 1.414 5.657 5.657 1.414-1.414L38.858 0zm-9.2 0l-1.414 1.414 4.95 4.95 1.414-1.414L29.658 0z\' fill=\'%2322c55e\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
//       },
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#86efac",
          DEFAULT: "#16a34a",
          dark: "#15803d",
        },
        fresh: {
          bg: "#ecfdf5",
          soft: "#d1fae5",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        fresh: "0 10px 25px rgba(22, 163, 74, 0.15)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
