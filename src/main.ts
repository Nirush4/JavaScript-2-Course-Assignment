import './style.css';
import { renderRoute } from './router';
import {
  handleGlobalError,
  catchUnhandledRejection,
} from './services/error/error';

// Render initial route content
renderRoute(window.location.pathname);

window.onerror = handleGlobalError;

window.addEventListener('unhandledrejection', catchUnhandledRejection);

window.addEventListener('popstate', (event) => {
  const path = event.state?.path || window.location.pathname;
  renderRoute(path);
});

document.body.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  // Check if the clicked element (or its ancestor) is an <a> with href starting with '/'
  const anchor = target.closest('a[href^="/"]') as HTMLAnchorElement | null;
  if (anchor) {
    event.preventDefault();
    const path = anchor.getAttribute('href');
    if (path) {
      history.pushState({ path }, '', path);
      renderRoute(path);
    }
  }
});
window.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  // find if any parent anchor
  const anchor = target.closest('a[data-link]');
  if (anchor) {
    e.preventDefault();
    const url = anchor.getAttribute('href');
    if (url) {
      history.pushState({}, '', url);
      renderRoute(url);
    }
  }
});

// Also handle back/forward
window.addEventListener('popstate', () => {
  renderRoute();
});













