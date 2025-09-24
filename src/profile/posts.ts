import type { Post, CreatePostPayload, UpdatePostPayload } from './types';
import { apiGetPostsByAuthor, apiCreatePost, apiUpdatePost, apiDeletePost, getAuthInfo } from './api';
import { withVer, bumpAssetVersion } from './cache';

const el = <K extends keyof HTMLElementTagNameMap>(t: K, c = '', h = '') => {
	const n = document.createElement(t);
	if (c) n.className = c;
	if (h) n.innerHTML = h;
	return n as HTMLElementTagNameMap[K];
};


const cleanUrl = (u: string) => {
	const s = (u || '').trim();
	if (!s) return '';
	if (/^https?:\/\//i.test(s)) return s;
	return `https://${s}`;
};

function postCard(p: Post, canEdit: boolean): HTMLElement {
	const card = el('article', 'card relative space-y-2');
	card.dataset.id = String(p.id);
	card.innerHTML = `
    <div class="flex items-start justify-between gap-4">
      <h3 class="font-semibold clamp-1">${p.title}</h3>
      ${
				canEdit
					? `
        <div class="flex gap-2 shrink-0">
          <button class="btn-secondary" data-action="edit">Edit</button>
          <button class="btn-primary" data-action="delete">Delete</button>
        </div>`
					: ``
			}
    </div>
    ${
			p.media?.url
				? `<img
        src="${withVer(p.media.url)}"
        referrerpolicy="no-referrer"
        crossorigin="anonymous"
        alt="${p.media?.alt || p.title}"
        class="w-full max-h-60 object-cover rounded-xl block"
      >`
				: ''
		}
    ${p.body ? `<p class="text-gray-700">${p.body}</p>` : ''}
  `;

	
	const img = card.querySelector('img');
	if (img) img.addEventListener('error', () => img.remove());

	return card;
}

function createForm(onSubmit: (payload: CreatePostPayload) => void): HTMLElement {
	const form = el('form', 'glass rounded-2xl p-4 space-y-3');
	form.innerHTML = `
    <h3 class="font-semibold">Create post</h3>
    <input name="title" required placeholder="Title" class="w-full px-3 py-2 rounded-xl border text-gray-900 bg-white">
    <textarea name="body" placeholder="Body (optional)" rows="3" class="w-full px-3 py-2 rounded-xl border text-gray-900 bg-white"></textarea>
    <div class="grid sm:grid-cols-2 gap-2">
      <input name="mediaUrl" placeholder="Image URL (optional)" class="px-3 py-2 rounded-xl border text-gray-900 bg-white">
      <input name="mediaAlt" placeholder="Image alt (optional)" class="px-3 py-2 rounded-xl border text-gray-900 bg-white">
    </div>
    <div class="flex justify-end">
      <button class="btn-primary" type="submit">Publish</button>
    </div>
  `;

	form.addEventListener('submit', async e => {
		e.preventDefault();
		const fd = new FormData(form as HTMLFormElement);
		const payload: CreatePostPayload = {
			title: String(fd.get('title') || '').trim(),
			body: String(fd.get('body') || '').trim() || undefined,
		};
		const mediaUrl = cleanUrl(String(fd.get('mediaUrl') || ''));
		const mediaAlt = String(fd.get('mediaAlt') || '').trim();
		if (mediaUrl) payload.media = { url: mediaUrl, alt: mediaAlt || undefined };

		onSubmit(payload);
		(form as HTMLFormElement).reset();
	});

	return form;
}

function editModal(onSave: (payload: UpdatePostPayload) => void, initial: Post): HTMLElement {
	const backdrop = el('div', 'profile-backdrop');
	const modal = el('div', 'profile-modal space-y-3');

	modal.innerHTML = `
    <h3>Edit post</h3>
    <input name="title" value="${initial.title ?? ''}" placeholder="Title">
    <textarea name="body" rows="4" placeholder="Body (optional)">${initial.body ?? ''}</textarea>
    <div class="grid sm:grid-cols-2 gap-2">
      <input name="mediaUrl" value="${initial.media?.url ?? ''}" placeholder="Image URL">
      <input name="mediaAlt" value="${initial.media?.alt ?? ''}" placeholder="Image alt">
    </div>
    <div class="flex justify-end gap-2">
      <button class="btn-secondary" data-action="cancel">Cancel</button>
      <button class="btn-primary" data-action="save">Save</button>
    </div>
  `;

	backdrop.appendChild(modal);

	backdrop.addEventListener('click', e => {
		if (e.target === backdrop || (e.target as HTMLElement).closest('[data-action="cancel"]')) {
			backdrop.remove();
		}
	});

	modal.querySelector('[data-action="save"]')!.addEventListener('click', () => {
		const title = (modal.querySelector('input[name="title"]') as HTMLInputElement).value.trim();
		const body = (modal.querySelector('textarea[name="body"]') as HTMLTextAreaElement).value.trim();
		const mediaUrl = cleanUrl((modal.querySelector('input[name="mediaUrl"]') as HTMLInputElement).value);
		const mediaAlt = (modal.querySelector('input[name="mediaAlt"]') as HTMLInputElement).value.trim();

		const payload: UpdatePostPayload = {};
		if (title) payload.title = title;
		payload.body = body || undefined;
		if (mediaUrl) payload.media = { url: mediaUrl, alt: mediaAlt || undefined };
		else payload.media = undefined;

		onSave(payload);
		backdrop.remove();
	});

	return backdrop;
}

export function mountPostsSection(host: HTMLElement, authorName: string) {
	const me = getAuthInfo()?.name;
	const canCreate = me && me.toLowerCase() === authorName.toLowerCase();

	const wrapper = el('section', 'space-y-4');
	const header = el('div', 'flex items-center justify-between');
	header.innerHTML = `<h2 class="text-xl font-semibold tracking-tight">Posts</h2>`;
	wrapper.appendChild(header);

	
	if (canCreate) {
		wrapper.appendChild(
			createForm(async payload => {
				try {
					await apiCreatePost(payload);
					if (payload.media?.url) bumpAssetVersion();
					await reload();
				} catch (e: any) {
					alert(e?.message || 'Failed to create post');
				}
			})
		);
	} else {
		const note = el('div', 'text-sm text-gray-600');
		note.textContent = 'You can create posts only on your own profile.';
		wrapper.appendChild(note);
	}

	const list = el('div', 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4');
	list.dataset.postsList = '1';
	wrapper.appendChild(list);

	host.appendChild(wrapper);

	async function reload() {
		list.innerHTML = Array.from({ length: 6 })
			.map(() => `<div class="sk h-28"></div>`)
			.join('');
		try {
			const res = await apiGetPostsByAuthor(authorName, 24);
			list.innerHTML = '';
			const posts = res.data || [];
			if (!posts.length) {
				list.innerHTML = `<p class="text-gray-600">No posts yet.</p>`;
				return;
			}
			for (const p of posts) {
				const card = postCard(p, Boolean(canCreate));
				card.addEventListener('click', e => {
					const btn = (e.target as HTMLElement).closest('button[data-action]');
					if (!btn) return;
					const action = btn.getAttribute('data-action');
					if (action === 'delete') {
						if (!confirm('Delete this post?')) return;
						apiDeletePost(p.id)
							.then(() => {
								bumpAssetVersion();
								reload();
							})
							.catch(err => alert(err?.message || 'Delete failed'));
					}
					if (action === 'edit') {
						document.body.appendChild(
							editModal(async payload => {
								try {
									await apiUpdatePost(p.id, payload);
									bumpAssetVersion();
									await reload();
								} catch (err: any) {
									alert(err?.message || 'Update failed');
								}
							}, p)
						);
					}
				});
				list.appendChild(card);
			}
		} catch (e: any) {
			list.innerHTML = `<div class="p-4 rounded-2xl bg-red-50 text-red-700">${
				e?.message || 'Failed to load posts.'
			}</div>`;
		}
	}

	reload();
}
