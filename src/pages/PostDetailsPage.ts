import { getAllPosts } from '../services/posts/posts';
import { DateTime } from 'luxon';
import type { Post } from '../types/noroff-types';



function hasDataArray(x: unknown): x is { data: Post[] } {
	return !!x && typeof x === 'object' && Array.isArray((x as any).data);
}

function safeId() {
	
	const rnd = globalThis.crypto?.randomUUID?.() as string | undefined;
	return rnd ?? `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function waitFor<T extends Element>(sel: string, tries = 20, delay = 50): Promise<T> {
	return new Promise((resolve, reject) => {
		const tick = (left: number) => {
			const el = document.querySelector<T>(sel);
			if (el) return resolve(el);
			if (left <= 0) return reject(new Error(`Selector not found: ${sel}`));
			setTimeout(() => tick(left - 1), delay);
		};
		tick(tries);
	});
}

function buildHeaders(extra: Record<string, string> = {}) {
	const accessToken = localStorage.getItem('accessToken') || '';
	const apiKey = localStorage.getItem('apiKey') || '';
	const headers: Record<string, string> = { ...extra };
	if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
	if (apiKey) headers['X-Noroff-API-Key'] = apiKey;
	return headers;
}


export default async function PostDetailsPage(params: string[] = []): Promise<string> {
	const id = Number(params[0]);
	if (isNaN(id)) return `<p class="text-red-400 text-center p-10">Invalid post ID</p>`;

	const raw: unknown = await getAllPosts();
	let posts: Post[] = [];
	if (Array.isArray(raw)) posts = raw as Post[];
	else if (hasDataArray(raw)) posts = raw.data;
	else return `<p class="text-red-400 text-center p-10">Error loading post</p>`;

	const initial = posts.find(p => Number((p as any).id) === id);
	if (!initial) return `<p class="text-red-400 text-center p-10">Post not found</p>`;

	const createdIso = (initial as any).createdAt || (initial as any).created || new Date().toISOString();
	const dt = DateTime.fromISO(createdIso);
	const relativeTime = dt.isValid ? dt.toRelative({ locale: 'en' }) || 'just now' : 'just now';

	const authorName =
		(initial as any).author?.name ?? (initial as any).author ?? `@user${(initial as any).userId ?? ''}`;
	const avatarUrl =
		(initial as any).author?.avatar?.url ||
		(initial as any).media?.url ||
		`https://i.pravatar.cc/100?u=${(initial as any).userId ?? 'x'}`;

	const likes = ((initial as any)._count?.reactions ?? (initial as any).reactions?.length ?? 0) as number;
	const commentsCount = ((initial as any)._count?.comments ?? (initial as any).comments?.length ?? 0) as number;
	const isLiked = Boolean((initial as any).isLiked);
	const followBtnLabel = (initial as any).isFollowing ? 'Unfollow' : 'Follow';
	const followBtnClass = (initial as any).isFollowing
		? 'bg-rose-600 hover:bg-rose-700'
		: 'bg-indigo-600 hover:bg-indigo-700';
	const mediaUrl = (initial as any).media?.url;
	const mediaAlt = (initial as any).media?.alt || 'Post image';

	const html = `
  <div class="min-h-dvh bg-gray-900 text-slate-200 px-5 py-8 pb-24 flex justify-center">
    <article class="w-full max-w-md bg-slate-800 text-slate-200 rounded-2xl shadow-xl border border-white/10 overflow-hidden">

      <!-- Header -->
      <header class="flex items-center gap-3 px-4 pt-4">
        <img src="${avatarUrl}" alt="${authorName}" class="h-12 w-12 rounded-full object-cover ring-2 ring-white/10" />
        <div class="leading-tight">
          <h1 class="text-xl font-extrabold text-white">${(initial as any).title ?? ''}</h1>
          <p class="text-xs text-slate-400">${relativeTime} • By <span class="font-semibold">${authorName}</span></p>
        </div>
        <button
          class="ml-auto inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold text-white ${followBtnClass} transition-colors"
          data-authorid="${(initial as any).userId ?? ''}" aria-label="${followBtnLabel} ${authorName}" type="button">
          ${followBtnLabel}
        </button>
      </header>

      <!-- Media -->
      ${
				mediaUrl
					? `
        <div class="px-4 pt-4">
          <img src="${mediaUrl}" alt="${mediaAlt}" class="w-full aspect-video object-cover rounded-xl" />
        </div>`
					: ''
			}

      <!-- Body -->
      <div class="px-4 pt-4">
        <p class="text-slate-300 leading-relaxed">${(initial as any).body ?? ''}</p>
      </div>

      <!-- Tags -->
      ${
				(initial as any).tags?.length
					? `
        <div class="px-4 pt-4 flex flex-wrap gap-2">
          ${((initial as any).tags as any[])
						.map(t => `<span class="bg-white/10 text-slate-300 text-xs px-3 py-1 rounded-full">#${t}</span>`)
						.join('')}
        </div>`
					: ''
			}

      <!-- Reactions / Back -->
      <div class="px-4 pt-4 pb-4 flex items-center justify-between border-t border-white/10 mt-4">
        <button class="like-btn flex items-center gap-2 ${
					isLiked ? 'text-pink-400' : 'text-pink-300'
				} hover:text-pink-400 transition-colors"
                data-postid="${(initial as any).id}" aria-pressed="${isLiked}" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
          </svg>
          <span class="font-semibold like-count">${likes}</span>
        </button>

        <div class="flex items-center gap-2 text-sm text-slate-300 cursor-pointer js-comments-count" role="button" tabindex="0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8l-4 4v-4H7a2 2 0 01-2-2v-2"/>
          </svg>
          <span class="comments-count">${commentsCount}</span>
        </div>

        <a id="back-to-feed" class="text-slate-300 hover:text-white text-sm underline underline-offset-4 cursor-pointer">← Back to Feed</a>
      </div>

    
      <section id="comments-section" class="px-4 pb-5">
        <h2 class="text-sm font-semibold text-slate-200">Comments</h2>
        <div id="comments-list" class="mt-2 space-y-3">
          <div class="text-xs text-slate-400">Loading comments…</div>
        </div>

        <form id="comment-form" class="mt-3 flex gap-2">
          <input id="comment-text" placeholder="Write a comment..." required
                 class="flex-1 px-3 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 text-slate-100 placeholder-slate-400 focus:outline-none"/>
          <button type="submit" class="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600">Post</button>
        </form>

        <div id="post-debug" class="mt-3 hidden bg-rose-900/30 text-rose-200 text-xs rounded p-2"></div>
      </section>

    </article>
  </div>
  `;


	setTimeout(() => {
		const headers = buildHeaders();

		const showDebug = async (msg: string, res?: Response) => {
			const box = document.getElementById('post-debug');
			if (!box) return;
			let body = '';
			if (res) {
				try {
					body = await res.text();
				} catch {}
			}
			box.classList.remove('hidden');
			box.innerText = [msg, res ? `STATUS: ${res.status}` : '', body].filter(Boolean).join('\n');
			console.error(msg, res?.status, body);
		};

		
		waitFor<HTMLAnchorElement>('#back-to-feed')
			.then(backBtn => {
				backBtn.addEventListener('click', e => {
					e.preventDefault();
					history.pushState({ path: '/feed' }, '', '/feed');
					(window as any).renderRoute?.('/feed');
				});
			})
			.catch(() => {});

	
		const fetchSingle = (postId: string | number, opts = '') =>
			fetch(`https://v2.api.noroff.dev/social/posts/${postId}${opts}`, { headers });

		const reconcileLikes = async (postId: string | number) => {
			try {
				const res = await fetchSingle(postId, '?_reactions=true');
				if (!res.ok) return;
				const data = await res.json().catch(() => null);
				const count =
					(data && (data.data?._count?.reactions ?? data.data?.reactions?.length)) ??
					data?._count?.reactions ??
					data?.reactions?.length;
				const likeCountEl = document.querySelector<HTMLElement>('.like-count');
				if (typeof count === 'number' && likeCountEl) likeCountEl.textContent = String(count);
			} catch {}
		};

		const loadComments = async (postId: string | number) => {
			const list = document.getElementById('comments-list') as HTMLElement | null;
			const countEl = document.querySelector<HTMLElement>('.comments-count');
			if (!list) return { list: null, comments: [] as any[] };

			try {
				const res = await fetchSingle(postId, '?_comments=true');
				if (!res.ok) {
					await showDebug('Comments GET failed', res);
					return { list, comments: [] as any[] };
				}
				const payload = await res.json().catch(() => null);
				const postData = payload?.data ?? payload;
				const arr = Array.isArray(postData?.comments) ? postData.comments : [];


				let currentUser = '';
				try {
					const rawUser = localStorage.getItem('user');
					if (rawUser) {
						const maybeObj = JSON.parse(rawUser);
						currentUser = (maybeObj && (maybeObj.name || maybeObj.username || maybeObj.email)) || rawUser;
					}
				} catch {
					currentUser = localStorage.getItem('user') || '';
				}
				currentUser = String(currentUser).toLowerCase();

				if (!arr.length) {
					list.innerHTML = `<div class="text-xs text-slate-400">No comments yet.</div>`;
					if (countEl) countEl.textContent = '0';
					return { list, comments: [] as any[] };
				}

				const html = arr
					.sort(
						(a: any, b: any) => +new Date(b?.created ?? b?.createdAt ?? 0) - +new Date(a?.created ?? a?.createdAt ?? 0)
					)
					.map((c: any) => {
						const isMine =
							String(c.author?.name || c.author?.username || c.author?.email || '').toLowerCase() === currentUser;

						return `
            <div class="flex gap-3 items-start" data-comment-id="${c.id}">
              <img src="${c.author?.avatar?.url ?? 'https://i.pravatar.cc/60?u=anon'}" alt=""
                   class="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 mt-0.5"/>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <div class="text-xs text-slate-400">
                    <span class="font-medium text-slate-300">${c.author?.name ?? 'Anonymous'}</span>
                    <span class="ml-2">
                      ${
												DateTime.fromISO(c.created ?? c.createdAt ?? new Date().toISOString()).isValid
													? DateTime.fromISO(c.created ?? c.createdAt ?? new Date().toISOString()).toRelative({
															locale: 'en',
													  }) ?? ''
													: ''
											}
                    </span>
                  </div>
                  ${
										isMine
											? `<button
  type="button"
  class="text-xs text-white opacity-70 hover:opacity-100 transition-opacity border-2 border-transparent hover:border-white rounded px-2 py-1"
  data-del-comment="${c.id}"
  title="Delete comment">
  Delete
</button>`
											: ''
									}
                </div>
                <div class="mt-1 bg-white/10 text-slate-200 px-3 py-2 rounded-md whitespace-pre-wrap break-words">${
									c.body ?? ''
								}</div>
              </div>
            </div>`;
					})
					.join('');

				list.innerHTML = html;
				if (countEl) countEl.textContent = String(arr.length);

				return { list, comments: arr as any[] };
			} catch {
				await showDebug('Comments GET network error');
				return { list, comments: [] as any[] };
			}
		};

	
		(async () => {
			const likeBtn = document.querySelector<HTMLButtonElement>('.like-btn');
			const postId = likeBtn?.dataset.postid;
			if (!postId) return;
			await reconcileLikes(postId);
			await loadComments(postId);
		})();

	
		Promise.all([waitFor<HTMLButtonElement>('.like-btn'), waitFor<HTMLElement>('.like-count')])
			.then(([likeBtn, likeCountEl]) => {
				likeBtn.addEventListener('click', async () => {
					const accessToken = localStorage.getItem('accessToken') || '';
					if (!accessToken) {
						await showDebug('Missing accessToken for LIKE');
						return;
					}
					const postId = likeBtn.dataset.postid!;
					const wasPressed = likeBtn.getAttribute('aria-pressed') === 'true';

			
					likeBtn.setAttribute('aria-pressed', (!wasPressed).toString());
					likeBtn.classList.toggle('text-pink-400', !wasPressed);
					likeBtn.classList.toggle('text-pink-300', wasPressed);
					const prev = parseInt(likeCountEl.textContent || '0', 10);
					likeCountEl.textContent = String(Math.max(0, prev + (wasPressed ? -1 : 1)));

					const headersNoCT = buildHeaders(); 
					const symbol = '❤️';
					const method = wasPressed ? 'DELETE' : 'PUT';

					let ok = false;
					let lastRes: Response | undefined;
					try {
						const res = await fetch(
							`https://v2.api.noroff.dev/social/posts/${postId}/react/${encodeURIComponent(symbol)}`,
							{ method, headers: headersNoCT }
						);
						lastRes = res;
						ok = res.ok;
					} catch {
						ok = false;
					}

					if (!ok) {
						
						likeBtn.setAttribute('aria-pressed', wasPressed.toString());
						likeBtn.classList.toggle('text-pink-400', wasPressed);
						likeBtn.classList.toggle('text-pink-300', !wasPressed);
						likeCountEl.textContent = String(prev);
						await showDebug('React failed', lastRes);
						return;
					}

					await reconcileLikes(postId);
				});
			})
			.catch(() => {});

		
		(async () => {
			let form: HTMLFormElement;
			let input: HTMLInputElement;
			try {
				[form, input] = await Promise.all([
					waitFor<HTMLFormElement>('#comment-form'),
					waitFor<HTMLInputElement>('#comment-text'),
				]);
			} catch {
				return;
			}

			const likeBtn = document.querySelector<HTMLButtonElement>('.like-btn');
			const postId = likeBtn?.dataset.postid;
			if (!postId) return;

		
			form.addEventListener('submit', async e => {
				e.preventDefault();
				const accessToken = localStorage.getItem('accessToken') || '';
				if (!accessToken) {
					await showDebug('Missing accessToken for COMMENT');
					return;
				}
				const text = input.value.trim();
				if (!text) return;

				
				const list = document.getElementById('comments-list') as HTMLElement | null;
				const optimisticHtml = `
          <div class="flex gap-3 items-start opacity-80" data-comment-id="${safeId()}">
            <img src="https://i.pravatar.cc/60?u=you" alt="" class="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 mt-0.5"/>
            <div class="flex-1">
              <div class="text-xs text-slate-400">
                <span class="font-medium text-slate-300">${((): string => {
									try {
										const raw = localStorage.getItem('user');
										if (!raw) return 'You';
										const o = JSON.parse(raw);
										return o?.name || o?.username || o?.email || 'You';
									} catch {
										return localStorage.getItem('user') || 'You';
									}
								})()}</span>
                <span class="ml-2">just now</span>
              </div>
              <div class="mt-1 bg-white/10 text-slate-200 px-3 py-2 rounded-md whitespace-pre-wrap break-words">${text}</div>
            </div>
          </div>`;
				if (list) list.innerHTML = optimisticHtml + list.innerHTML;
				input.value = '';

				try {
					const res = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}/comment`, {
						method: 'POST',
						headers: buildHeaders({ 'Content-Type': 'application/json' }),
						body: JSON.stringify({ body: text }),
					});
					if (!res.ok) await showDebug('Comment POST failed', res);
					await loadComments(postId); 
				} catch {
					await showDebug('Comment POST network error');
					await loadComments(postId);
				}
			});

			
			const list = await waitFor<HTMLElement>('#comments-list').catch(() => null);
			if (list) {
				list.addEventListener('click', async e => {
					const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-del-comment]');
					if (!btn) return;
					const commentId = btn.getAttribute('data-del-comment');
					if (!commentId) return;

					const accessToken = localStorage.getItem('accessToken') || '';
					if (!accessToken) {
						await showDebug('Missing accessToken for DELETE COMMENT');
						return;
					}

					if (!confirm('Delete this comment?')) return;

					try {
						const res = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}/comment/${commentId}`, {
							method: 'DELETE',
							headers,
						});
						if (!res.ok) {
							await showDebug('Delete comment failed', res);
							return;
						}
						await loadComments(postId);
					} catch {
						await showDebug('Delete comment network error');
					}
				});
			}
		})();
	}, 0);

	return html;
}
