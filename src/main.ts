import './style.css';
import { renderRoute } from './router';
import {
  handleGlobalError,
  catchUnhandledRejection,
} from './services/error/error';

// Render initial content based on the current path
renderRoute(window.location.pathname);

window.onerror = handleGlobalError;

window.addEventListener('unhandledrejection', catchUnhandledRejection);

// We need to listen to the browser changes
window.addEventListener('popstate', (event) => {
  const path = event.state ? event.state.path : window.location.pathname;
  console.log(`Navigating to ${path} via popstate`);
  renderRoute(path);
});

const linkEls: NodeListOf<HTMLAnchorElement> =
  document.querySelectorAll('#js-primary-nav a');

if (linkEls) {
  linkEls.forEach((link) => link.addEventListener('click', navigate));
}

function navigate(event: MouseEvent) {
  event.preventDefault();
  let path: string | null;

  const el = event?.target as HTMLAnchorElement;

  path = el.getAttribute('href');

  if (typeof path === 'string') {
    // Change the URL in the address bar
    history.pushState({ path: path }, '', path);

    // Update the content based on the path
    renderRoute(path);
  }
}
