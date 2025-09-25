import LoginPage from '../pages/LoginPage';
import FeedPage from '../pages/FeedPage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import PostDetailsPage from '../pages/PostDetailsPage';
import { lazyLoadImgs } from '../utils/lazy-load-img';
import { APP_CONTAINER_CLASSNAME } from '../constants';

const PATHS = {
  login: {
    url: '/',
    component: LoginPage,
  },
  feed: {
    url: '/feed',
    component: FeedPage,
    protected: true,
  },
  about: {
    url: '/about',
    component: AboutPage,
  },
  postDetails: {
    url: /^\/posts\/(\d+)$/, // regex to match /posts/123 and capture id
    component: PostDetailsPage,
  },
} as const;

// Example isLoggedIn helper, modify based on your auth logic
function isLoggedIn(): boolean {
  const accessToken = localStorage.getItem('accessToken');
  // Basic check — token exists and is not expired (optional)
  return !!accessToken;
}

export default async function router(
  currentPath = '',
  routes = PATHS
): Promise<string> {
  const currentRoute = Object.values(routes).find(
    (route) => route.url === currentPath
  );

  let html = await NotFoundPage();

  if (currentRoute) {
    if ((currentRoute as any).protected && !isLoggedIn()) {
      // Redirect unauthenticated users to login page
      history.pushState({ path: '/' }, '', '/');
      html = await LoginPage();
    } else if (currentPath === '/' && isLoggedIn()) {
      // Redirect logged in users from login page to feed
      history.pushState({ path: '/feed' }, '', '/feed');
      html = await FeedPage();
    } else {
      html = await currentRoute.component();
    }
  }

  return html;
}

export async function renderRoute(path?: string) {
  path = path ?? window.location.pathname;
  const contentContainer = document.getElementById(APP_CONTAINER_CLASSNAME);
  if (!path || !contentContainer) return;

  contentContainer.innerHTML = await router(path);

  // After render, lazy load images if needed
  lazyLoadImgs();

  // Attach back button handler if on post details page
  if (path.startsWith('/posts/') && path !== '/posts') {
    const backBtn = document.getElementById('back-button');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, '', '/posts');
        renderRoute('/posts');
      });
    }
  }
}
