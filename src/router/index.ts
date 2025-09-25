import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import FeedPage from '../pages/FeedPage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import PostDetailsPage from '../pages/PostDetailsPage';
import { lazyLoadImgs } from '../utils/lazy-load-img';
import { APP_CONTAINER_CLASSNAME } from '../constants';

const PATHS = {
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
  about: {
    url: '/about',
    component: AboutPage,
    protected: true,
  },
  postDetails: {
    url: /^\/posts\/(\d+)$/,
    component: PostDetailsPage,
    protected: true,
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
  // Treat '/' as '/login' internally
  if (currentPath === '/') {
    currentPath = '/login';
  }

  // Find matching route — add special handling for regex routes
  const currentRoute = Object.values(routes).find((route) => {
    if (route.url instanceof RegExp) {
      return route.url.test(currentPath);
    }
    return route.url === currentPath;
  });

  let html = await NotFoundPage();

  if (currentRoute) {
    if (currentRoute.protected && !isLoggedIn()) {
      // Redirect unauthenticated users to login page
      history.replaceState({ path: '/login' }, '', '/login');
      html = await LoginPage();
    } else if (
      (currentPath === '/login' || currentPath === '/') &&
      isLoggedIn()
    ) {
      // Redirect logged in users from login to feed
      history.replaceState({ path: '/feed' }, '', '/feed');
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

  const loadingScreen = (window as any).loadingScreen;

  // Show loading screen for login and register pages with message
  if (loadingScreen && (path === '/' || path === '/register')) {
    loadingScreen.showWithMessage(
      path === '/' ? 'Loading Sign In...' : 'Loading Registration...'
    );

    // Small delay to improve UX
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Render the route content
  contentContainer.innerHTML = await router(path);

  // Hide loading screen after render for login and register
  if (loadingScreen && (path === '/login' || path === '/register')) {
    setTimeout(() => {
      loadingScreen.hideLoadingScreen();
    }, 500);
  }

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
