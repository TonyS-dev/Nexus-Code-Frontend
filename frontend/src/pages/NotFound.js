// frontend/src/pages/NotFound.js
import { router } from '../router/router.js';

export function renderNotFoundPage() {
    const container = document.createElement('div');
    container.className =
        'w-full h-full flex items-center justify-center p-4 bg-background-secondary';

    container.innerHTML = `
        <div class="text-center">
            <i class="fa-solid fa-compass text-6xl text-primary opacity-75"></i>
            <h2 class="mt-6 text-3xl font-bold text-text-primary">404 - Page Not Found</h2>
            <p class="mt-2 text-base text-text-secondary">Sorry, we couldn’t find the page you’re looking for.</p>
            <div class="mt-8">
                <button id="back-btn" class="bg-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-primary-hover transition-colors">
                    Go back home
                </button>
            </div>
        </div>
    `;
    container
        .querySelector('#back-btn')
        .addEventListener('click', () => router.navigate('/dashboard'));
    return container;
}
