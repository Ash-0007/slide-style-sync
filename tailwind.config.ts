
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
				// Custom theme colors
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
				}
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out'
			},
			backgroundImage: {
				'gradient-purple': 'linear-gradient(102.3deg, rgba(150,122,161,0.9) 5.9%, rgba(170,161,200,0.9) 64%, rgba(213,198,224,0.9) 89%)',
				'gradient-soft': 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)',
				'gradient-lavender': 'linear-gradient(to right, #f5e6e8, #d5c6e0)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
