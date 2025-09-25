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
