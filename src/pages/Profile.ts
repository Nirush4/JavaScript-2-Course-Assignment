const API_URL = 'https://v2.api.noroff.dev';

type Media = { url?: string; alt?: string };
type Author = { name: string; avatar?: Media };
type Post = {
	id: number;
	title: string;
	body?: string;
	media?: Media;
	author: Author;
	created: string;
	updated: string;
};

function getToken(): string | null {
	const raw = localStorage.getItem('accessToken');
	if (!raw) return null;
	try {
		const maybe = JSON.parse(raw);
		if (typeof maybe === 'string') return maybe;
	} catch {}
	return raw;
}

function getCurrentUserNameFromJWT(token: string | null): string | null {
	if (!token) return null;
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload?.name ?? null;
	} catch {
		return null;
	}
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
	const token = getToken();
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(options.headers || {}),
		},
	});
	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`API ${res.status}: ${text || res.statusText}`);
	}
	if (res.status === 204) return undefined as unknown as T;
	return (await res.json()) as T;
}

function h<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	attrs: Record<string, any> = {},
	...children: (Node | string | null | undefined)[]
) {
	const el = document.createElement(tag);
	Object.entries(attrs).forEach(([k, v]) => {
		if (v === null || v === undefined) return;
		if (k === 'class') (el as HTMLElement).className = v;
		else if (k.startsWith('on') && typeof v === 'function') {
			el.addEventListener(k.slice(2).toLowerCase(), v);
		} else if (k === 'dataset' && typeof v === 'object') {
			Object.entries(v).forEach(([dk, dv]) => ((el as HTMLElement).dataset[dk] = String(dv)));
		} else {
			(el as any)[k] !== undefined ? ((el as any)[k] = v) : el.setAttribute(k, String(v));
		}
	});
	for (const ch of children) {
		if (ch === null || ch === undefined) continue;
		el.append(ch instanceof Node ? ch : document.createTextNode(ch));
	}
	return el;
}

function showError(container: HTMLElement, msg: string) {
	const box = h('div', { class: 'error' }, `⚠️ ${msg}`);
	container.prepend(box);
	setTimeout(() => box.remove(), 5000);
}

function formatDate(iso: string) {
	try {
		return new Date(iso).toLocaleString();
	} catch {
		return iso;
	}
}

function interceptLink(ev: MouseEvent) {
	const a = ev.currentTarget as HTMLAnchorElement;
	if (a && a.href && a.origin === location.origin) {
		ev.preventDefault();
		history.pushState({ path: a.pathname }, '', a.pathname);
		if (typeof (window as any).renderRoute === 'function') {
			(window as any).renderRoute(a.pathname);
		} else if (typeof (window as any).renderSocialRoute === 'function') {
			(window as any).renderSocialRoute(a.pathname);
		} else {
			location.assign(a.pathname);
		}
	}
}

async function fetchAllPosts(limit = 50, offset = 0) {
	return api<{ data: Post[] }>(`/social/posts?_author=true&limit=${limit}&offset=${offset}`);
}

async function fetchMyProfile(name: string) {
	return api<{ data: Author }>(`/social/profiles/${encodeURIComponent(name)}`);
}

async function fetchMyPosts(name: string) {
	return api<{ data: Post[] }>(`/social/profiles/${encodeURIComponent(name)}/posts?_author=true&limit=100&offset=0`);
}

async function createPost(input: { title: string; body?: string; media?: Media }) {
	return api<{ data: Post }>(`/social/posts`, { method: 'POST', body: JSON.stringify(input) });
}

async function updatePost(id: number, input: { title?: string; body?: string; media?: Media }) {
	return api<{ data: Post }>(`/social/posts/${id}`, { method: 'PUT', body: JSON.stringify(input) });
}

async function deletePost(id: number) {
	return api<void>(`/social/posts/${id}`, { method: 'DELETE' });
}

function renderNav() {
	return h(
		'nav',
		{ class: 'nav' },
		h('a', { href: '/feed', onclick: interceptLink }, 'Feed'),
		' | ',
		h('a', { href: '/profile', onclick: interceptLink }, 'Profile')
	);
}

async function renderFeed(root: HTMLElement) {
	root.innerHTML = '';
	const token = getToken();
	const userName = getCurrentUserNameFromJWT(token);
	const nav = renderNav();
	const page = h('div', { class: 'feed-page' });
	root.append(nav, page);
	if (!token || !userName) {
		page.append(
			h(
				'div',
				{ class: 'auth-guard' },
				'You must be logged in to see posts. ',
				h('a', { href: '/login', onclick: interceptLink }, 'Go to login')
			)
		);
		return;
	}
	const header = h('section', { class: 'feed-header' }, h('h1', {}, 'All posts'));
	const listWrap = h('section', { class: 'posts' }, h('div', { id: 'feedList' }, 'Loading...'));
	page.append(header, listWrap);
	try {
		const { data: posts } = await fetchAllPosts(50, 0);
		renderPostListReadOnly(listWrap.querySelector('#feedList') as HTMLElement, posts);
	} catch (e: any) {
		showError(page, e.message ?? 'Error loading posts.');
	}
}

function renderPostListReadOnly(listEl: HTMLElement, posts: Post[]) {
	listEl.innerHTML = '';
	if (!posts.length) {
		listEl.append(h('div', {}, 'No posts.'));
		return;
	}
	posts
		.slice()
		.sort((a, b) => +new Date(b.created) - +new Date(a.created))
		.forEach(post => {
			const card = h(
				'article',
				{ class: 'post' },
				h('h3', {}, post.title),
				post.media?.url ? h('img', { src: post.media.url, alt: post.media.alt || post.title, width: 600 }) : null,
				post.body ? h('p', {}, post.body) : null,
				h('small', {}, `by @${post.author?.name} · ${formatDate(post.created)}`)
			);
			listEl.append(card);
		});
}

async function renderProfile(root: HTMLElement) {
	root.innerHTML = '';
	const token = getToken();
	const userName = getCurrentUserNameFromJWT(token);
	const nav = renderNav();
	const page = h('div', { class: 'profile-page' });
	root.append(nav, page);
	if (!token || !userName) {
		page.append(
			h(
				'div',
				{ class: 'auth-guard' },
				'You must be logged in to see your profile. ',
				h('a', { href: '/login', onclick: interceptLink }, 'Go to login')
			)
		);
		return;
	}
	const header = h(
		'section',
		{ class: 'profile-header' },
		h('h1', {}, `@${userName}`),
		h('div', { id: 'profileAvatar' })
	);
	const createForm = renderCreateForm(async payload => {
		try {
			await createPost(payload);
			await reloadPosts();
			(createForm as HTMLFormElement).reset();
		} catch (e: any) {
			showError(page, e.message ?? 'Failed to create post.');
		}
	});
	const postsWrap = h(
		'section',
		{ class: 'posts' },
		h('h2', {}, 'Your posts'),
		h('div', { id: 'postsList' }, 'Loading...')
	);
	page.append(header, createForm, postsWrap);
	try {
		const [{ data: profile }, { data: posts }] = await Promise.all([fetchMyProfile(userName), fetchMyPosts(userName)]);
		renderProfileHeader(header, profile);
		renderMyPosts(postsWrap.querySelector('#postsList') as HTMLElement, posts, userName, async () => {
			await reloadPosts();
		});
	} catch (e: any) {
		showError(page, e.message ?? 'Error loading profile.');
	}
	async function reloadPosts() {
		const list = postsWrap.querySelector('#postsList') as HTMLElement;
		list.textContent = 'Refreshing...';
		const { data: posts } = await fetchMyPosts(userName!);
		renderMyPosts(list, posts, userName!, async () => {
			await reloadPosts();
		});
	}
}

function renderProfileHeader(container: HTMLElement, profile: Author) {
	const avatarUrl = profile?.avatar?.url;
	const avatar = avatarUrl
		? h('img', { src: avatarUrl, alt: profile?.avatar?.alt || `${profile.name} avatar`, width: 80, height: 80 })
		: h('div', { class: 'avatar-fallback' }, '👤');
	const box = h('div', { class: 'profile-box' }, avatar, h('div', {}, h('div', {}, `Name: ${profile.name}`)));
	const target = container.querySelector('#profileAvatar')!;
	target.innerHTML = '';
	target.append(box);
}

function renderCreateForm(onSubmit: (payload: { title: string; body?: string; media?: Media }) => void) {
	const form = h(
		'form',
		{
			class: 'create-post',
			onsubmit: (e: Event) => {
				e.preventDefault();
				const fd = new FormData(form as HTMLFormElement);
				const title = String(fd.get('title') || '').trim();
				const body = String(fd.get('body') || '').trim();
				const mediaUrl = String(fd.get('mediaUrl') || '').trim();
				const mediaAlt = String(fd.get('mediaAlt') || '').trim();
				if (!title) {
					alert('Title is required.');
					return;
				}
				const payload: { title: string; body?: string; media?: Media } = { title };
				if (body) payload.body = body;
				if (mediaUrl) payload.media = { url: mediaUrl, alt: mediaAlt || undefined };
				onSubmit(payload);
			},
		},
		h('h2', {}, 'Create post'),
		h('label', {}, 'Title'),
		h('input', { name: 'title', type: 'text', placeholder: 'Post title', required: true }),
		h('label', {}, 'Body (optional)'),
		h('textarea', { name: 'body', rows: 4, placeholder: 'Write something...' }),
		h(
			'div',
			{},
			h('label', {}, 'Image URL (optional)'),
			h('input', { name: 'mediaUrl', type: 'url', placeholder: 'https://...' })
		),
		h(
			'div',
			{},
			h('label', {}, 'Image ALT (optional)'),
			h('input', { name: 'mediaAlt', type: 'text', placeholder: 'Short description' })
		),
		h('button', { type: 'submit' }, 'Create')
	);
	return form;
}

function renderMyPosts(listEl: HTMLElement, posts: Post[], myName: string, onChanged: () => void) {
	listEl.innerHTML = '';
	const mine = posts.filter(p => p.author?.name === myName);
	if (!mine.length) {
		listEl.append(h('div', {}, 'No posts.'));
		return;
	}
	mine
		.slice()
		.sort((a, b) => +new Date(b.created) - +new Date(a.created))
		.forEach(post => {
			const postBox = h(
				'article',
				{ class: 'post', dataset: { id: String(post.id) } },
				h('h3', {}, post.title),
				post.media?.url ? h('img', { src: post.media.url, alt: post.media.alt || post.title, width: 600 }) : null,
				post.body ? h('p', {}, post.body) : null,
				h('small', {}, `Created: ${formatDate(post.created)} · Updated: ${formatDate(post.updated)}`),
				h(
					'div',
					{ class: 'actions' },
					h('button', { type: 'button', onclick: () => toggleEdit(postBox, post, onChanged) }, 'Edit'),
					h(
						'button',
						{
							type: 'button',
							onclick: async () => {
								if (!confirm('Delete this post?')) return;
								try {
									await deletePost(post.id);
									await onChanged();
								} catch (e: any) {
									alert(e.message ?? 'Failed to delete post.');
								}
							},
						},
						'Delete'
					)
				)
			);
			listEl.append(postBox);
		});
}

function toggleEdit(host: HTMLElement, post: Post, onChanged: () => void) {
	const existing = host.querySelector('.edit-form');
	if (existing) {
		existing.remove();
		return;
	}
	const form = h(
		'form',
		{
			class: 'edit-form',
			onsubmit: async (e: Event) => {
				e.preventDefault();
				const fd = new FormData(form as HTMLFormElement);
				const title = String(fd.get('title') || '').trim();
				const body = String(fd.get('body') || '').trim();
				const mediaUrl = String(fd.get('mediaUrl') || '').trim();
				const mediaAlt = String(fd.get('mediaAlt') || '').trim();
				const payload: { title?: string; body?: string; media?: Media } = {};
				if (title && title !== post.title) payload.title = title;
				if (body !== (post.body || '')) payload.body = body;
				if (mediaUrl || mediaAlt || post.media?.url) {
					payload.media = { url: mediaUrl || undefined, alt: mediaAlt || undefined };
				}
				try {
					await updatePost(post.id, payload);
					await onChanged();
				} catch (e: any) {
					alert(e.message ?? 'Failed to update post.');
				}
			},
		},
		h('h4', {}, 'Edit post'),
		h('label', {}, 'Title'),
		h('input', { name: 'title', type: 'text', value: post.title }),
		h('label', {}, 'Body'),
		h('textarea', { name: 'body', rows: 4 }, post.body || ''),
		h(
			'div',
			{},
			h('label', {}, 'Image URL'),
			h('input', { name: 'mediaUrl', type: 'url', value: post.media?.url || '' })
		),
		h(
			'div',
			{},
			h('label', {}, 'Image ALT'),
			h('input', { name: 'mediaAlt', type: 'text', value: post.media?.alt || '' })
		),
		h(
			'div',
			{ class: 'edit-actions' },
			h('button', { type: 'submit' }, 'Save'),
			h('button', { type: 'button', onclick: () => form.remove() }, 'Cancel')
		)
	);
	host.append(form);
}

export function renderSocialRoute(path: string, mountId = 'app') {
	const root = document.getElementById(mountId)!;
	if (path === '/profile') {
		renderProfile(root);
		return;
	}
	if (path === '/feed' || path === '/') {
		renderFeed(root);
		return;
	}
	root.innerHTML = '';
	root.append(renderNav(), h('div', { class: 'not-found' }, 'Not found'));
}

(window as any).renderSocialRoute = renderSocialRoute;
