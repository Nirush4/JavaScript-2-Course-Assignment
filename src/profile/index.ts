// import './tailwind.css';
// import './profile.css';

import { ProfilePage } from './page';
export { ProfilePage };

export { UserProfilePage } from './user';

export function mountProfilePage(root: HTMLElement) {
	return ProfilePage(root);
}

import { primeDevTokenAndKey } from './dev-auth';
if ((import.meta as any)?.env?.DEV) {
	primeDevTokenAndKey(true);
}

(function autoMount() {
	const app = document.getElementById('app');
	if (!app) return;
	const path = location.pathname.replace(/\/+$/, '');
	if (path.startsWith('/u/')) {
		const name = decodeURIComponent(path.slice(3));
		
		import('./user').then(m => m.UserProfilePage(app, name));
		return;
	}
	if (path === '/profile' || path.endsWith('/profile/index.html')) {
		mountProfilePage(app);
	}
})();
