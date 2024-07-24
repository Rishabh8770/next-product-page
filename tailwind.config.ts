import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        status: {
          pending: {
            text: '#6B7280', // text-gray-500
            bg: '#E5E7EB',   // bg-gray-200
          },
          active: {
            text: '#10B981', // text-green-500
            bg: '#D1FAE5',   // bg-green-100
          },
          rejected: {
            text: '#EF4444', // text-red-500
            bg: '#FEE2E2',   // bg-red-100
          },
          default: {
            text: '#FFFFFF', // text-white
            bg: '#374151',   // bg-gray-700
          },
        },
      },
      boxShadow: {
        'status-active': '0 10px 15px -3px rgb(31, 137, 18, 0.5)', // shadow-green-300
        'status-rejected': '0 10px 15px -3px rgba(239, 68, 68, 0.5)', // shadow-red-300
        'status-pending': '0 10px 15px -3px rgba(107, 114, 128, 0.5)', // shadow-gray-300
        'status-default': '0 10px 15px -3px rgba(0, 0, 0, 0.5)', // shadow-black
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
