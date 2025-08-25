// // frontend/src/views/forbidden.js
// import { auth } from '../auth.js';

// /**
//  * Displays a styled 'access denied' message that adapts based on authentication status.
//  */
// export function renderForbidden() {
//     const isAuthenticated = auth.isAuthenticated();
//     const targetEl = isAuthenticated ? document.getElementById('app-content') : document.getElementById('app');

//     // If the element is not found, do nothing (prevents errors during logout transitions)
//     if (!targetEl) return;
    
//     const buttonText = isAuthenticated ? 'Back to Dashboard' : 'Back to Login';
//     const targetHash = isAuthenticated ? '#/dashboard' : '#/login';
    
//     targetEl.innerHTML = `
//     <div class="status-page-container">
//         <div class="status-content">
//             <i class="fa-solid fa-lock status-icon"></i>
//             <h2>403 - Access Denied</h2>
//             <p>You do not have permission to view this page.</p>
//             <button id="status-back-btn" class="btn-primary">${buttonText}</button>
//         </div>
//     </div>
//   `;

//     document.getElementById('status-back-btn').onclick = () => {
//         location.hash = targetHash;
//     };
// }