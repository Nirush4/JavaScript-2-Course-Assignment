// src/router/index.ts
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import { lazyLoadImgs } from '../utils/lazy-load-img';
import { APP_CONTAINER_CLASSNAME } from '../constants';

import { ProfilePage, UserProfilePage } from '../profile';
import { getAuthInfo } from '../profile/api';





const PATHS = {
  home:  { url: '/',      component: HomePage },
  about: { url: '/about', component: AboutPage },
} as const;

export default async function router(currentPath = '', routes = PATHS): Promise<string> {
  const match = Object.values(routes).find(r => r.url === currentPath);
  let html = await NotFoundPage();
  if (match) html = await match.component();
  return html;
}


function setActiveNav(path: string) {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach(a => {
    const href   = new URL(a.getAttribute('href') || '/', location.origin).pathname;
    const extra  = a.getAttribute('data-active-for'); 
    const active = href === path || (!!extra && path.startsWith(extra));
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

export async function renderRoute(path?: string) {
  const resolvedPath = path ?? window.location.pathname;
  const container = document.getElementById(APP_CONTAINER_CLASSNAME);
  if (!resolvedPath || !container) return;


  if (resolvedPath.startsWith('/u/')) {
    const name = decodeURIComponent(resolvedPath.slice(3));
    const me = getAuthInfo();
    const isOwner = !!me?.name && me.name.toLowerCase() === name.toLowerCase();

    if (isOwner) {
      await ProfilePage(container);            // Create/Edit/Delete
    } else {
      await UserProfilePage(container, name); 
    }
    setActiveNav(resolvedPath);
    return;
  }


  if (resolvedPath === '/profile') {
    const me = getAuthInfo();
    if (me?.name) {
      const target = `/u/${encodeURIComponent(me.name)}`;
      history.replaceState({ path: target }, '', target);
      await ProfilePage(container);
      setActiveNav(target);
      return;
    }
   
  }


  container.innerHTML = await router(resolvedPath);
  lazyLoadImgs();
  setActiveNav(resolvedPath);
}


document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a[data-link]') as HTMLAnchorElement | null;
  if (!a) return;

  const url = new URL(a.getAttribute('href') || '/', location.origin);
  if (url.origin !== location.origin || a.target === '_blank' || a.hasAttribute('download')) return;

  e.preventDefault();
  const nextPath = url.pathname;
  if (location.pathname !== nextPath) {
    history.pushState({ path: nextPath }, '', nextPath);
  }
  renderRoute(nextPath);
});

window.addEventListener('popstate', () => renderRoute(location.pathname));
