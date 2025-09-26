import { renderRoute } from '../router';

// ✅ Reusable logout button component
export default function logoutBtn(): string {
  return `
    <button
      id="logout-btn"
      type="button"
      class="rounded-xl bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
    >
      Log out
    </button>
  `;
}

// ✅ Init function to attach logout logic
export function initLogoutBtn() {
  const btn = document.getElementById('logout-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Clear only auth-related storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('apiKey');
    localStorage.removeItem('user');

    // Redirect to login
    history.pushState({ path: '/' }, '', '/');
    renderRoute('/');
  });
}
