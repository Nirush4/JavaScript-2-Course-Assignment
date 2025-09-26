import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import FeedPage from '../pages/FeedPage';
import NotFoundPage from '../pages/NotFoundPage';
import PostDetailsPage from '../pages/PostDetailsPage';
import ProfilePage from '../pages/Profile'; 
import { lazyLoadImgs } from '../utils/lazy-load-img';
import { APP_CONTAINER_CLASSNAME } from '../constants';

const PATHS = {
	home: {
		url: '/',
		component: LoginPage, 
		protected: false,
	},
	login: {
		url: '/login',
		component: LoginPage,
		protected: false,
	},
	register: {
		url: '/register',
		component: RegisterPage,
		protected: false,
	},
	feed: {
		url: '/feed',
		component: FeedPage,
		protected: true,
	},
	profile: {
		url: '/profile', 
		component: ProfilePage, 
		protected: true, 
	},
	postDetails: {
		url: /^\/post\/(\d+)$/,
		component: PostDetailsPage,
		protected: true,
	},
};

function isLoggedIn(): boolean {
	const accessToken = localStorage.getItem('accessToken');
	return !!accessToken;
}

export default async function router(currentPath = '', routes = PATHS): Promise<string> {
	currentPath = currentPath || window.location.pathname;

	let routeParams: string[] = [];
	let matchedRoute: any = null;

	for (const key of Object.keys(routes)) {
		const route = (routes as any)[key];
		if (typeof route.url === 'string') {
			if (route.url === currentPath) {
				matchedRoute = route;
				break;
			}
		} else if (route.url instanceof RegExp) {
			const m = currentPath.match(route.url);
			if (m) {
				matchedRoute = route;
				routeParams = m.slice(1);
				break;
			}
		}
	}

	let html: string;

	if (!matchedRoute) {
		html = await NotFoundPage();
	} else {
		if (matchedRoute.protected && !isLoggedIn()) {
			history.replaceState({}, '', '/login');
			html = await LoginPage();
		} else {
		
			html = await matchedRoute.component(routeParams);
		}
	}

	return html;
}

export async function renderRoute(path?: string) {
	const current = path ?? window.location.pathname;


	const contentContainer = document.getElementById(APP_CONTAINER_CLASSNAME);
	if (!contentContainer) return;

	contentContainer.innerHTML = await router(current);
	lazyLoadImgs();


	if (current.match(/^\/post\/\d+$/)) {
		const backBtn = document.getElementById('back-to-feed');
		if (backBtn) {
			backBtn.addEventListener('click', e => {
				e.preventDefault();
				history.pushState({}, '', '/feed');
				renderRoute('/feed');
			});
		}
	}
}
