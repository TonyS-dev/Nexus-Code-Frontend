// frontend/src/views/dashboard.js
export function showDashboardPage() {
    const div = document.createElement('div');
    div.innerHTML = `<h1>Welcome to your Dashboard!</h1>`;
    return div;
}
