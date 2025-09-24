import type { ProfileData } from './types';
import { apiGetDemoProfile, apiGetProfileByName } from './api';
import { withVer } from './cache';
import { mountPostsSection } from './posts';

const S = { root: '#profile-root', input: '#profile-handle', btnLoad: '#btn-load-profile', btnDemo: '#btn-load-demo' };

const el = <K extends keyof HTMLElementTagNameMap>(t: K, c = '', h = '') => {
	const n = document.createElement(t);
	if (c) n.className = c;
	if (h) n.innerHTML = h;
	return n as HTMLElementTagNameMap[K];
};

const skeletonHeader = () => `
  <div class="sk h-56 md:h-72"></div>
  <div class="sk h-24 mt-3"></div>
`;

function errorBox(host: HTMLElement, msg: string) {
	host.innerHTML = `<div class="p-4 rounded-2xl bg-red-50 text-red-700">${msg}</div>`;
}

function header(p: ProfileData): HTMLElement {
	const wrap = el('section', 'relative rounded-[24px] overflow-hidden shadow-xl bg-white');

	const bannerUrl = withVer(p.banner?.url);
	const hero = el('div', 'relative');
	hero.innerHTML = `
    <div class="relative h-56 md:h-72 bg-gray-200">
      ${
				bannerUrl
					? `<img src="${bannerUrl}" alt="${
							p.banner?.alt || 'Banner'
					  }" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />`
					: `<div class="absolute inset-0 bg-gradient-to-br from-indigo-300 via-emerald-200 to-pink-200"></div>`
			}
      <div class="hero-overlay"></div>
      <div class="absolute bottom-4 left-28 md:left-40 text-white font-extrabold tracking-tight"
           style="font-size: clamp(2rem, 6vw, 4rem); text-shadow: 0 10px 30px rgba(0,0,0,.35)">
        ${p.name}
      </div>
    </div>
  `;
	wrap.appendChild(hero);

	const bar = el('div', 'glass -mt-8 mx-4 md:mx-6 rounded-[20px] px-6 pt-10 pb-6 relative');
	bar.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="space-y-1">
        <p class="text-sm text-gray-700">${p.email || ''}</p>
        <p class="text-gray-800">${p.bio || 'This user has not added a bio yet.'}</p>
      </div>
      <div class="flex gap-3">
        <button type="button" class="btn-secondary" data-action="message">Message</button>
        <button type="button" class="btn-primary" data-action="edit">Edit profile</button>
      </div>
    </div>
  `;
	wrap.appendChild(bar);

	const a = withVer(p.avatar?.url);
	const avatar = el('div', 'absolute -top-12 left-8 md:left-10');
	avatar.innerHTML = `
    <div class="avatar-frame">
      ${
				a
					? `<img src="${a}" alt="${p.avatar?.alt || 'Avatar'}" loading="lazy" />`
					: `<div class="fallback">${p.name?.[0]?.toUpperCase() || 'U'}</div>`
			}
    </div>
  `;
	bar.appendChild(avatar);

	wrap.addEventListener('click', e => {
		const btn = (e.target as HTMLElement).closest('button[data-action]') as HTMLButtonElement | null;
		if (!btn) return;
		alert(btn.dataset.action === 'edit' ? 'Edit profile coming soon' : 'Messaging coming soon');
	});

	return wrap;
}

function about(p: ProfileData): HTMLElement {
	const card = el('section', 'bg-white rounded-[24px] shadow p-6 md:p-8 space-y-4');
	card.innerHTML = `
    <h2 class="text-xl font-semibold tracking-tight">About</h2>
    <div class="grid sm:grid-cols-2 gap-3 text-gray-800">
      <p><span class="font-medium">Name:</span> ${p.name}</p>
      ${p.email ? `<p><span class="font-medium">Email:</span> ${p.email}</p>` : ''}
    </div>
    <p class="text-gray-800">${p.bio || 'No bio.'}</p>
  `;
	return card;
}

async function renderProfile(host: HTMLElement, data: ProfileData) {
	host.innerHTML = '';
	host.appendChild(header(data));
	host.appendChild(about(data));
	mountPostsSection(host, data.name); 
}

export function initProfileView() {
	const root = document.querySelector(S.root) as HTMLElement | null;
	const input = document.querySelector(S.input) as HTMLInputElement | null;
	const btnLoad = document.querySelector(S.btnLoad) as HTMLButtonElement | null;
	const btnDemo = document.querySelector(S.btnDemo) as HTMLButtonElement | null;
	if (!root || !input || !btnLoad || !btnDemo) return;

	const $root = root;

	async function loadByName(name: string) {
		if (!name) return;
		$root.innerHTML = skeletonHeader();
		try {
			const res = await apiGetProfileByName(name);
			await renderProfile($root, res.data);
		} catch (e: any) {
			errorBox($root, e?.message || 'Failed to load profile.');
		}
	}

	function loadDemo() {
		const res = apiGetDemoProfile();
		renderProfile($root, res.data);
	}

	btnLoad.addEventListener('click', () => loadByName(input.value.trim()));
	btnDemo.addEventListener('click', loadDemo);

	const initial = new URLSearchParams(location.search).get('name');
	if (initial) {
		input.value = initial;
		loadByName(initial);
	}
}
