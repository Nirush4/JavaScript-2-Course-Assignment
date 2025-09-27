
import { logout } from '../router';


export default function logoutBtn(id = 'logout-btn', label = 'Logout'): string {
	return `
    <button
      id="${id}"
      type="button"
      class="rounded-xl bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
      aria-label="${label}"
    >
      ${label}
    </button>
  `;
}


export function initLogoutBtn(id = 'logout-btn', root?: HTMLElement) {
	const scope = root ?? document;
	const btn = scope.querySelector<HTMLButtonElement>('#' + id);
	if (!btn) return;

	btn.addEventListener('click', e => {
		e.preventDefault();
		logout();
	});
}
