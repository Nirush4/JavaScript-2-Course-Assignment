import { getMe, getMyPosts, apiCreatePost, apiUpdatePost, apiDeletePost } from './api';

const pencilSvg = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
     stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M17 3l4 4-10 10H7v-4L17 3z"></path>
</svg>`.trim();

const trashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
     stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
</svg>`.trim();

export async function ProfilePage(root: HTMLElement): Promise<void> {
	root.innerHTML = `
    <div class="flex flex-col items-center mt-10 top-container s:mt-10 md:mt-30 lg:mt-30">
      <div class="top flex justify-center gap-5 pb-5 max-w-3xl border-b-1 border-gray-600 s:gap-10 md:pb-12">
        <div class="text-center">
          <div class="mx-auto overflow-hidden border-2 border-blue-300 rounded-full w-25 h-25 hover:border-text-blue-500 s:border-4 s:w-30 s:h-30 md:w-40 md:h-40">
            <img id="profile-img" src="/public/profile.avif" alt="Profile Picture" class="object-cover w-full h-full"/>
          </div>
          <label for="file-input" class="block mt-4 text-blue-200 cursor-pointer">Change Profile Picture</label>
          <input type="file" id="file-input" class="hidden" accept="image/*"/>
        </div>

        <div class="text-div">
          <div class="flex items-center mb-4 space-x-4 justify-self-start s:mt-5">
            <div class="text-xl font-medium text-gray-200 md:text-2xl">
              <span id="profile-name">me</span>
            </div>
            <button id="edit-btn" class="text-blue-100 hover:text-blue-300" aria-label="Edit name">${pencilSvg}</button>
          </div>

          <div class="post-followers-following flex flex-wrap gap-3 md:gap-10" id="profileMetrics"></div>

          <div class="flex items-center mt-10 mb-4 space-x-4 justify-self-start">
            <div class="text-gray-200 text-s font-small s:text-m md:text-lg">
              <span id="bio-text">—</span>
            </div>
            <button id="edit-bio-btn" class="text-blue-100 hover:text-blue-300" aria-label="Edit bio">${pencilSvg}</button>
          </div>
        </div>
      </div>

      <div class="flex justify-center posts-tagged gap-15">
        <div class="flex items-center justify-center gap-1 text-gray-200 uppercase cursor-pointer posts text-xs/10 text-md w-fit border-t-1 border-vibPink">
          <i class="fa-solid fa-image"></i> POSTS
        </div>
        <div class="flex items-center justify-center gap-1 text-xs text-gray-200 uppercase cursor-pointer tagged text-md w-fit">
          <i class="fa-solid fa-people-arrows"></i> TAGGED
        </div>
      </div>

      <div class="mt-6">
        <button id="btn-create-post" class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none">
          + Create post
        </button>
      </div>
    </div>

    <div id="js-grid"
      class="flex h-full w-full max-w-6xl grid-cols-3 gap-1 mt-40 text-white place-items-start body-content row-span-3 pl-10 sm:mt-20 md:mt-72 md:pl-10">
      <div id="js-app" class="l-app-container w-full"></div>
    </div>

    <div id="post-editor" class="fixed inset-0 hidden items-center justify-center bg-black/50 z-50">
      <div class="w-[min(640px,90vw)] rounded-xl bg-blue-1000 border border-white/20 p-4">
        <h3 id="editor-title" class="text-xl font-semibold mb-3 text-white">Create post</h3>
        <div class="grid gap-3">
          <input id="f-title" class="p-2 rounded bg-transparent border border-white/30 text-white" placeholder="Title" />
          <textarea id="f-body" class="p-2 rounded bg-transparent border border-white/30 text-white" rows="5" placeholder="Body (optional)"></textarea>
          <input id="f-image" class="p-2 rounded bg-transparent border border-white/30 text-white" placeholder="Image URL (optional)" />
        </div>
        <div class="mt-4 flex gap-2 justify-end">
          <button id="btn-cancel" class="px-3 py-2 rounded bg-gray-300 text-gray-900 hover:bg-gray-200">Cancel</button>
          <button id="btn-save"   class="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
        </div>
        <p id="editor-error" class="mt-3 text-red-300 text-sm hidden"></p>
      </div>
    </div>
  `;

	const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector(sel) as T | null;

	let posts: any[] = [];

	
	const editor = $<HTMLDivElement>('#post-editor')!;
	const editorTitle = $<HTMLHeadingElement>('#editor-title')!;
	const fTitle = $<HTMLInputElement>('#f-title')!;
	const fBody = $<HTMLTextAreaElement>('#f-body')!;
	const fImage = $<HTMLInputElement>('#f-image')!;
	const btnSave = $<HTMLButtonElement>('#btn-save')!;
	const btnCancel = $<HTMLButtonElement>('#btn-cancel')!;
	const errBox = $<HTMLParagraphElement>('#editor-error')!;
	let editingId: number | null = null;

	function openEditor(mode: 'create' | 'edit', data?: any) {
		editorTitle.textContent = mode === 'create' ? 'Create post' : 'Edit post';
		editingId = mode === 'edit' ? Number(data?.id) : null;
		fTitle.value = data?.title ?? '';
		fBody.value = data?.body ?? '';
		fImage.value = data?.media?.url ?? '';
		errBox.classList.add('hidden');
		editor.classList.remove('hidden');
		fTitle.focus();
	}
	function closeEditor() {
		editor.classList.add('hidden');
		editingId = null;
		fTitle.value = fBody.value = fImage.value = '';
	}

	$<HTMLButtonElement>('#btn-create-post')?.addEventListener('click', () => openEditor('create'));
	btnCancel.addEventListener('click', closeEditor);
	btnSave.addEventListener('click', async () => {
		try {
			btnSave.disabled = true;
			errBox.classList.add('hidden');
			if (!fTitle.value.trim()) {
				errBox.textContent = 'Title is required';
				errBox.classList.remove('hidden');
				return;
			}
			if (fImage.value && !/^https?:\/\//i.test(fImage.value)) {
				errBox.textContent = 'Image URL must start with http(s)';
				errBox.classList.remove('hidden');
				return;
			}

			const payload: any = { title: fTitle.value.trim() };
			if (fBody.value.trim()) payload.body = fBody.value.trim();
			if (fImage.value.trim()) payload.media = { url: fImage.value.trim(), alt: payload.title };

			if (editingId == null) await apiCreatePost(payload);
			else await apiUpdatePost(editingId, payload);

			closeEditor();
			await refreshPosts();
		} catch (e: any) {
			errBox.textContent = e?.message || 'Save failed';
			errBox.classList.remove('hidden');
		} finally {
			btnSave.disabled = false;
		}
	});

	$<HTMLDivElement>('#js-app')?.addEventListener('click', async ev => {
		const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
		if (!btn) return;
		const id = Number(btn.dataset.id);
		if (btn.dataset.action === 'edit') {
			const data = posts.find(p => Number(p.id) === id);
			openEditor('edit', data);
		}
		if (btn.dataset.action === 'delete') {
			if (!confirm('Delete this post?')) return;
			await apiDeletePost(id);
			await refreshPosts();
		}
	});

	async function hydrate() {
		const [me, myPosts] = await Promise.all([getMe(), getMyPosts(30)]);
		posts = myPosts || [];

		const avatar = me?.avatar?.url || '/public/profile.avif';
		const avatarEl = $<HTMLImageElement>('#profile-img');
		if (avatarEl) avatarEl.src = avatar;

		const nameEl = $('#profile-name');
		if (nameEl) nameEl.textContent = me?.name ?? 'me';

		const bioEl = $('#bio-text');
		if (bioEl) bioEl.textContent = me?.bio ?? me?.email ?? '';

		const followers =
			(me as any)?._count?.followers ?? (Array.isArray((me as any)?.followers) ? (me as any).followers.length : 0);
		const following =
			(me as any)?._count?.following ?? (Array.isArray((me as any)?.following) ? (me as any).following.length : 0);

		const metrics = $<HTMLDivElement>('#profileMetrics');
		if (metrics) {
			metrics.innerHTML = `
        <span>Posts: <strong>${posts.length}</strong></span>
        <span>Followers: <strong>${followers}</strong></span>
        <span>Following: <strong>${following}</strong></span>
      `;
		}

		renderPosts();
	}

	async function refreshPosts() {
		const my = await getMyPosts(30);
		posts = my || [];
		renderPosts();
	}

	function renderPosts() {
		const grid = $<HTMLDivElement>('#js-app');
		if (!grid) return;
		grid.innerHTML = posts.length
			? posts
					.map(
						(p: any) => `
          <article class="post-card w-full rounded-xl overflow-hidden border border-white/15 bg-white/5">
            ${p.media?.url ? `<img src="${p.media.url}" alt="" class="w-full h-44 object-cover">` : ''}
            <div class="mt-2 flex items-start justify-between gap-2 p-3">
              <div>
                <h3 class="font-semibold">${p.title ?? 'Untitled'}</h3>
                ${p.body ? `<p class="opacity-80 text-sm">${p.body}</p>` : ''}
              </div>
              <div class="flex gap-2 shrink-0">
                <button class="p-1 rounded hover:bg-white/10" title="Edit" data-action="edit" data-id="${p.id}">
                  ${pencilSvg}
                </button>
                <button class="p-1 rounded hover:bg-white/10" title="Delete" data-action="delete" data-id="${p.id}">
                  ${trashSvg}
                </button>
              </div>
            </div>
          </article>
        `
					)
					.join('')
			: `<p class="opacity-80">No posts yet.</p>`;
	}


	const file = $<HTMLInputElement>('#file-input');
	file?.addEventListener('change', () => {
		const f = file.files?.[0];
		if (!f) return;
		const img = $<HTMLImageElement>('#profile-img');
		if (img) img.src = URL.createObjectURL(f);
	});

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
