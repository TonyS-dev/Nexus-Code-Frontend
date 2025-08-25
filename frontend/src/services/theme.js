// src/services/theme.js
const html = document.documentElement;

function applyTheme(theme) {
    html.classList.remove('theme-light', 'theme-dark');
    html.classList.add(`theme-${theme}`);

    const logo = document.querySelector('.riwi-logo');
    if (logo) {
        const logoPath = logo.getAttribute(
            theme === 'light' ? 'data-logo-light' : 'data-logo-dark'
        );
        if (logoPath) logo.src = logoPath;
    }

    const themeToggle = document.querySelector('#themeToggle');
    if (themeToggle) {
        const sun = themeToggle.querySelector('.sun');
        const moon = themeToggle.querySelector('.moon');
        if (sun && moon) {
            sun.style.opacity = theme === 'light' ? 1 : 0;
            moon.style.opacity = theme === 'dark' ? 1 : 0;
        }
    }
}

export function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

export function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
}
