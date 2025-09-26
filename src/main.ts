import './style.css';
import { renderRoute } from './router';
import { handleGlobalError, catchUnhandledRejection } from './services/error/error';


renderRoute(window.location.pathname);


window.onerror = handleGlobalError;
window.addEventListener('unhandledrejection', catchUnhandledRejection);


window.addEventListener('popstate', event => {
	const path = event.state ? event.state.path : window.location.pathname;
	console.log(`Navigating to ${path} via popstate`);
	renderRoute(path);
});


document.addEventListener('click', e => {
	const a = (e.target as HTMLElement)?.closest('a[data-link]') as HTMLAnchorElement | null;
	if (!a) return;


	if (a.target === '_blank' || a.host !== window.location.host) return;
	if (
		(e as MouseEvent).metaKey ||
		(e as MouseEvent).ctrlKey ||
		(e as MouseEvent).shiftKey ||
		(e as MouseEvent).altKey
	) {
		return;
	}

	e.preventDefault();


	const path = a.pathname + a.search + a.hash;
	navigate(path);
});


function navigate(path: string) {
	if (!path) path = '/';
	history.pushState({ path }, '', path);
	renderRoute(path);
	highlightActive(path);
}


function highlightActive(currentPath: string) {
	document.querySelectorAll('a[data-link]').forEach(el => {
		const a = el as HTMLAnchorElement;
		const same = a.pathname === currentPath; 
		a.classList.toggle('active', same);
	});
}




document.addEventListener('click', e => {
	const a = (e.target as HTMLElement)?.closest('a[data-link]') as HTMLAnchorElement | null;
	if (!a) return;

	const href = a.getAttribute('href');
	if (!href) return;

	
	if (href === '/profile' || '/') {
		e.preventDefault();
		window.location.href = href; 
		return;
	}

	
	const url = new URL(href, location.origin);
	if (url.origin !== location.origin || a.target === '_blank' || a.hasAttribute('download')) return;

	if (
		(e as MouseEvent).metaKey ||
		(e as MouseEvent).ctrlKey ||
		(e as MouseEvent).shiftKey ||
		(e as MouseEvent).altKey
	) {
		return;
	}

	e.preventDefault();
	const nextPath = url.pathname + url.search + url.hash;
	if (location.pathname !== nextPath) {
		history.pushState({ path: nextPath }, '', nextPath);
	}
	renderRoute(nextPath);
});


function setActiveNav(path: string) {
	document.querySelectorAll<HTMLAnchorElement>('a[data-link], a[href="/"], a[href="/profile"]').forEach(a => {
		const href = new URL(a.getAttribute('href') || '/', location.origin).pathname.replace(/\/$/, '') || '/';
		const current = path.replace(/\/$/, '') || '/';

		const isActive = href === current;
		a.classList.toggle('active', isActive);

		if (isActive) {
			a.setAttribute('aria-current', 'page');
		} else {
			a.removeAttribute('aria-current');
		}
	});
}
window.addEventListener('popstate', () => {
	renderRoute(location.pathname);
	setActiveNav(location.pathname); 
});