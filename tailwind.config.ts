import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				heading: ['Poppins', 'sans-serif'],
				display: ['"SF Pro Display"', 'sans-serif']
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// New color system based on the proposal
				// Removing deep purple definition
				// deep: {
				// 	purple: '#5D4A8C',
				// 	teal: '#21B6A8'
				// },
				neutral: {
					50: '#F8F8F8',
					100: '#F0F0F0',
					200: '#E4E4E4',
					300: '#D1D1D1',
					400: '#B4B4B4',
					500: '#919191',
					600: '#6D6D6D',
					700: '#5C5C5C',
					800: '#474747',
					900: '#333333',
				},
				// Custom theme colors - existing
				lavender: {
					DEFAULT: '#f5e6e8',
					100: '#441b20',
					200: '#883641',
					300: '#bf5e6b',
					400: '#daa2a9',
					500: '#f5e6e8',
					600: '#f7ebec',
					700: '#f9f0f1',
					800: '#fbf5f6',
					900: '#fdfafa'
				},
				thistle: {
					DEFAULT: '#d5c6e0',
					100: '#2c1e37',
					200: '#593b6e',
					300: '#8559a5',
					400: '#ae90c3',
					500: '#d5c6e0',
					600: '#ded2e7',
					700: '#e6dded',
					800: '#efe8f3',
					900: '#f7f4f9'
				},
				rosequartz: {
					DEFAULT: '#aaa1c8',
					100: '#1f1b2e',
					200: '#3e365b',
					300: '#5e5089',
					400: '#8274ad',
					500: '#aaa1c8',
					600: '#bcb4d3',
					700: '#ccc7de',
					800: '#dddae9',
					900: '#eeecf4'
				},
				mountbatten: {
					DEFAULT: '#967aa1',
					100: '#1e1721',
					200: '#3c2f42',
					300: '#5a4662',
					400: '#785d83',
					500: '#967aa1',
					600: '#aa94b3',
					700: '#bfaec6',
					800: '#d4c9d9',
					900: '#eae4ec'
				},
				spacecadet: {
					DEFAULT: '#192a51',
					100: '#050810',
					200: '#0a1121',
					300: '#0f1931',
					400: '#142242',
					500: '#192a51',
					600: '#2c4a90',
					700: '#466dc6',
					800: '#849dd9',
					900: '#c1ceec'
				},
				// --- Replace with New Color Palette --- 
				raisin_black: {
					DEFAULT: '#1a1423',
					100: '#050407',
					200: '#0b080e',
					300: '#100c15',
					400: '#15101c',
					500: '#1a1423',
					600: '#45365d',
					700: '#705797',
					800: '#9f8cbd',
					900: '#cfc5de'
				},
				mountbattenpink: {
					DEFAULT: '#a07178',
					100: '#f1e8ea',
					200: '#e4d2d5',
					300: '#d6bbc0',
					400: '#c9a5ab',
					500: '#bb8f97',
					600: '#a07178',
					700: '#7e595f',
					800: '#5e4247',
					900: '#402c30'
				},
				mint_green: {
					DEFAULT: '#e9fff9',
					100: '#006248',
					200: '#00c490',
					300: '#27ffc5',
					400: '#89ffdf',
					500: '#e9fff9',
					600: '#effffb',
					700: '#f3fffc',
					800: '#f7fffd',
					900: '#fbfffe'
				},
				// Add midnight_green back
				midnight_green: {
					DEFAULT: '#1e555c',
					100: '#061112',
					200: '#0c2225',
					300: '#123337',
					400: '#18444a',
					500: '#1e555c',
					600: '#318b97',
					700: '#4fb8c6',
					800: '#8ad0d9',
					900: '#c4e7ec'
				}
				// --- End New Color Palette ---
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': { 
						transform: 'translateX(100%)' 
					},
					'100%': { 
						transform: 'translateX(0)' 
					}
				},
				'float': {
					'0%, 100%': { 
						transform: 'translateY(0)' 
					},
					'50%': { 
						transform: 'translateY(-5px)' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'float': 'float 5s ease-in-out infinite'
			},
			backgroundImage: {
				// Updated gradients based on the new color system
				'gradient-primary': 'linear-gradient(135deg, #1e555c 0%, #318b97 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #21B6A8 0%, #4FD1C5 100%)',
				'gradient-accent': 'linear-gradient(135deg, #E6B54A 0%, #F6D06C 100%)',
				'gradient-coral': 'linear-gradient(135deg, #FF7F6B 0%, #FFA28F 100%)',
				'gradient-soft': 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)',
			},
			boxShadow: {
				'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
				'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
				'button': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'button-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
