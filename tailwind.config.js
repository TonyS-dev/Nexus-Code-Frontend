// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}', // Scans all your JS files for Tailwind classes
    ],
    theme: {
        extend: {
            // Here, we map your CSS variables to Tailwind's theme
            colors: {
                primary: {
                    DEFAULT: 'var(--primary-color)',
                    light: 'var(--primary-light)',
                    hover: 'var(--primary-hover)',
                },
                secondary: 'var(--secondary-color)',
                accent: 'var(--accent-color)',
                success: 'var(--success-color)',
                warning: 'var(--warning-color)',
                danger: 'var(--danger-color)',
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                },
                background: {
                    primary: 'var(--background-primary)',
                    secondary: 'var(--background-secondary)',
                    tertiary: 'var(--background-tertiary)',
                },
            },
            boxShadow: {
                special: 'var(--special-shadow)',
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
            },
        },
    },
    plugins: [],
};
