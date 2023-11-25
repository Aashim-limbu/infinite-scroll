/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			animation: {
				skeleton: "skeleton 1s ease-in-out infinite alternate",
			},
			keyframes: {
				skeleton: {
					"0%": { opacity: "0.5" },
					"100%": { opacity: "1" },
				},
			},
		},
	},
	variants: {},
	plugins: [],
};
