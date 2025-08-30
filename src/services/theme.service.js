/**
 * @file theme.service.js
 * @description Manages the application's light/dark theme.
 */
const html = document.documentElement;

/**
 * Applies a specified theme to the application.
 * @param {string} theme - The theme to apply ('light' or 'dark').
 */
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
            sun.style.display = theme === 'light' ? 'block' : 'none';
            moon.style.display = theme === 'dark' ? 'block' : 'none';
        }
    }
}

/**
 * Toggles the theme between light and dark and saves the preference.
 */
export function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

/**
 * Initializes the theme on application load based on saved preference or system settings.
 */
export function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
}
