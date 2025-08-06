/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./app/**/*.{js,ts,jsx,tsx}",
	  "./pages/**/*.{js,ts,jsx,tsx}",
	  "./components/**/*.{js,ts,jsx,tsx}",
	  "./modules/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  extend: {
		colors: {
		  'zendenta': {
			primary: '#06B6D4', // Teal color
			secondary: '#4A6572',
			accent: '#F9A826',
			positive: '#34D399',
			danger: '#F87171',
			warning: '#FBBF24',
		  },
		  'healthcare': {
			primary: '#007C7C',    // Emerald Green
			secondary: '#20B2AA',  // Light Sea Green
			teal: '#008080',       // Teal
			emerald: '#50C878',    // Emerald
			indigo: '#4F46E5',     // Indigo accent
			'cool-white': '#FAFAFA',
			'soft-grey': '#F3F4F6',
			dark: '#1F2937',
		  },
		},
		fontFamily: {
		  'sans': ['Inter', 'Satoshi', 'ui-sans-serif', 'system-ui'],
		  'serif': ['Playfair Display', 'ui-serif', 'Georgia'],
		  'display': ['Inter', 'Satoshi', 'Poppins', 'sans-serif'],
		},
		boxShadow: {
		  'zendenta': '0 4px 12px rgba(0, 0, 0, 0.05)',
		  'zendenta-lg': '0 10px 25px rgba(0, 0, 0, 0.1)',
		  'healthcare-sm': '0 1px 3px rgba(0, 0, 0, 0.12)',
		  'healthcare': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		  'healthcare-md': '0 6px 10px -1px rgba(0, 0, 0, 0.1), 0 2px 5px -1px rgba(0, 0, 0, 0.06)',
		  'healthcare-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		},
		borderRadius: {
		  'zendenta': '10px',
		  'healthcare-sm': '0.375rem',  /* 6px */
		  'healthcare': '0.5rem',      /* 8px */
		  'healthcare-md': '0.75rem',   /* 12px */
		  'healthcare-lg': '1rem',      /* 16px */
		  'healthcare-xl': '1.5rem',    /* 24px */
		},
		transitionDuration: {
		  '400': '400ms',
		},
		animation: {
		  'pulse-gentle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
		},
		zIndex: {
		  'dropdown': '50',
		  'modal': '100',
		  'tooltip': '60',
		},
	  },
	},
	plugins: [],
  }