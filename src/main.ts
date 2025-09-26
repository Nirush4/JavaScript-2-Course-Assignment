import './style.css';
import { renderRoute } from './router';
import {
  handleGlobalError,
  catchUnhandledRejection,
} from './services/error/error';
import initFeedPageScripts from '../src/pages/initFeedPageScript';

// Utility: Check if path is "/feed" and run page-specific script
function handlePageSpecificScripts(path: string) {
  if (path === '/feed') {
    initFeedPageScripts();
  }
}

// Main render function
function navigateTo(path: string) {
  history.pushState({ path }, '', path);
  renderRoute(path);
  handlePageSpecificScripts(path);
}

// Initial load
const initialPath = window.location.pathname;
renderRoute(initialPath);
handlePageSpecificScripts(initialPath);

// Global error handlers
window.onerror = handleGlobalError;
window.addEventListener('unhandledrejection', catchUnhandledRejection);

// Single popstate handler
window.addEventListener('popstate', (event) => {
  const path = event.state?.path || window.location.pathname;
  renderRoute(path);
  handlePageSpecificScripts(path);
});

// Anchor link handling (internal routing)
document.body.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const anchor = target.closest(
    'a[href^="/"], a[data-link]'
  ) as HTMLAnchorElement | null;

  if (anchor) {
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('/')) {
      event.preventDefault();
      navigateTo(href);
    }
  }
});
