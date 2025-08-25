// frontend/src/components/navbar.js
export function Navbar() {
    const navElement = document.createElement('nav');
    navElement.className = 'navbar';
    navElement.innerHTML = `
        <h1>Nexus Code</h1>
        <button id="logout-btn">Logout</button>
    `;
    // Event delegation for logout
    navElement.querySelector('#logout-btn').onclick = () => {
        /* Logout logic */
    };
    return navElement;
}