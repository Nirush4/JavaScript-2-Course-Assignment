import {
	apiGetProfileByName,
	apiGetPostsByAuthor,
	apiCreatePost,
	apiUpdatePost,
	apiDeletePost,
	getAuthInfo,
} from './api';

const pencil = '✏️';
const bin = '🗑';

export async function UserProfilePage(root: HTMLElement, name: string): Promise<void> {
	root.innerHTML = `
    <section class="p-6 max-w-5xl w-full mx-auto">
      <div id="header" class="flex items-center gap-5 pb-6 border-b border-white/30">
        <div class="w-24 h-24 rounded-full bg-white/20 overflow-hidden">
          <img id="avatar" class="w-full h-full object-cover" alt="">
        </div>
        <div class="text-white">
          <div class="text-2xl font-semibold" id="uname"></div>
          <div class="opacity-80" id="uemail"></div>
        </div>
      </div>

      <p class="mt-4 opacity-90">Posts: <strong id="postCount">0</strong></p>
      <h2 class="text-xl font-semibold mt-4">Posts by <span id="by"></span></h2>

      <div class="mt-4">
        <button id="btn-create" class="hidden px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">+ Create post</button>
      </div>

      <div id="grid" class="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"></div>

      <!-- prosty edytor -->
      <div id="editor" class="fixed inset-0 hidden items-center justify-center bg-black/50 z-50">
        <div class="w-[min(640px,90vw)] rounded-xl bg-blue-1000 border border-white/20 p-4">
          <h3 id="ed-title" class="text-xl font-semibold mb-3 text-white">Create post</h3>
          <div class="grid gap-3">
            <input id="f-title" class="p-2 rounded bg-transparent border border-white/30 text-white" placeholder="Title"/>
            <textarea id="f-body" class="p-2 rounded bg-transparent border border-white/30 text-white" rows="5" placeholder="Body (optional)"></textarea>
            <input id="f-image" class="p-2 rounded bg-transparent border border-white/30 text-white" placeholder="Image URL (optional)"/>
          </div>
          <div class="mt-4 flex gap-2 justify-end">
            <button id="ed-cancel" class="px-3 py-2 rounded bg-gray-300 text-gray-900 hover:bg-gray-200">Cancel</button>
            <button id="ed-save"   class="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
          </div>
          <p id="ed-err" class="mt-3 text-red-300 text-sm hidden"></p>
        </div>
      </div>
    </section>
  `;

	const $ = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector(s) as T | null;
	const me = getAuthInfo();
	const isOwner = !!me?.name && me.name.toLowerCase() === name.toLowerCase();

	let posts: any[] = [];

	async function hydrate() {
		const [pEnv, postsEnv] = await Promise.all([apiGetProfileByName(name), apiGetPostsByAuthor(name, 30)]);
		const u = pEnv.data;
		posts = postsEnv.data || [];

		$('#avatar')!.setAttribute('src', u?.avatar?.url || '/profile.avif');
		$('#uname')!.textContent = u?.name ?? name;
		$('#uemail')!.textContent = u?.email ?? '';
		$('#by')!.textContent = u?.name ?? name;
		$('#postCount')!.textContent = String(posts.length);

		const bCreate = $('#btn-create')!;
		if (isOwner) bCreate.classList.remove('hidden');

		renderPosts();
	}

	async function refreshPosts() {
		const refreshed = await apiGetPostsByAuthor(name, 30);
		posts = refreshed.data || [];
		renderPosts();
	}

	function renderPosts() {
		const grid = $('#grid')!;
		grid.innerHTML = posts.length
			? posts
					.map(
						(p: any) => `
        <article class="rounded-xl overflow-hidden border border-white/15 bg-white/5">
          ${p.media?.url ? `<img src="${p.media.url}" class="w-full h-48 object-cover" alt="">` : ''}
          <div class="p-3 flex items-start justify-between gap-2">
            <div>
              <h3 class="font-semibold">${p.title ?? 'Untitled'}</h3>
              ${p.body ? `<p class="opacity-80 text-sm">${p.body}</p>` : ''}
            </div>
            ${
							isOwner
								? `
            <div class="flex gap-2 shrink-0">
              <button data-action="edit" data-id="${p.id}" class="p-1 rounded hover:bg-white/10" title="Edit">${pencil}</button>
              <button data-action="delete" data-id="${p.id}" class="p-1 rounded hover:bg-white/10" title="Delete">${bin}</button>
            </div>`
								: ''
						}
          </div>
        </article>
      `
					)
					.join('')
			: `<p class="opacity-80">No posts yet.</p>`;
	}

	
	const ed = $('#editor')!;
	const edT = $('#ed-title')!;
	const fT = $('#f-title') as HTMLInputElement;
	const fB = $('#f-body') as HTMLTextAreaElement;
	const fI = $('#f-image') as HTMLInputElement;
	const eErr = $('#ed-err') as HTMLParagraphElement;
	const bSave = $('#ed-save') as HTMLButtonElement;
	const bCancel = $('#ed-cancel') as HTMLButtonElement;
	const bCreate = $('#btn-create') as HTMLButtonElement;

	let editingId: number | null = null;

	function openEd(mode: 'create' | 'edit', data?: any) {
		edT.textContent = mode === 'create' ? 'Create post' : 'Edit post';
		editingId = mode === 'edit' ? Number(data?.id) : null;
		fT.value = data?.title ?? '';
		fB.value = data?.body ?? '';
		fI.value = data?.media?.url ?? '';
		eErr.classList.add('hidden');
		ed.classList.remove('hidden');
		fT.focus();
	}
	function closeEd() {
		ed.classList.add('hidden');
		editingId = null;
		fT.value = fB.value = fI.value = '';
	}

	if (isOwner) {
		bCreate?.addEventListener('click', () => openEd('create'));
		bCancel?.addEventListener('click', closeEd);
		bSave?.addEventListener('click', async () => {
			try {
				if (!fT.value.trim()) {
					eErr.textContent = 'Title is required';
					eErr.classList.remove('hidden');
					return;
				}
				if (fI.value && !/^https?:\/\//i.test(fI.value)) {
					eErr.textContent = 'Image URL must start with http(s)';
					eErr.classList.remove('hidden');
					return;
				}

				const payload: any = { title: fT.value.trim() };
				if (fB.value.trim()) payload.body = fB.value.trim();
				if (fI.value.trim()) payload.media = { url: fI.value.trim(), alt: payload.title };

				if (editingId == null) await apiCreatePost(payload);
				else await apiUpdatePost(editingId, payload);

				closeEd();
				await refreshPosts();
			} catch (e: any) {
				eErr.textContent = e?.message || 'Save failed';
				eErr.classList.remove('hidden');
			}
		});

		$('#grid')!.addEventListener('click', async ev => {
			const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
			if (!btn) return;
			const id = Number(btn.dataset.id);
			if (btn.dataset.action === 'edit') {
				const p = posts.find((x: any) => Number(x.id) === id);
				openEd('edit', p);
			}
			if (btn.dataset.action === 'delete') {
				if (!confirm('Delete this post?')) return;
				await apiDeletePost(id);
				await refreshPosts();
			}
		});
	}

	await hydrate();

	
	const onFocus = () => refreshPosts();
	const onVis = () => {
		if (!document.hidden) refreshPosts();
	};
	window.addEventListener('focus', onFocus);
	document.addEventListener('visibilitychange', onVis);
	const refreshTimer = window.setInterval(refreshPosts, 60000);
	window.addEventListener(
		'popstate',
		() => {
			window.removeEventListener('focus', onFocus);
			document.removeEventListener('visibilitychange', onVis);
			clearInterval(refreshTimer);
		},
		{ once: true }
	);
}
