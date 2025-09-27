// src/pages/PostDetailsPage.ts
import { getAllPosts } from '../services/posts/posts';
import { DateTime } from 'luxon';
import { API_URL } from '../constants';
import { getToken } from '../services/api/client';
import type { Post } from '../types/noroff-types';

// guard: czy obiekt ma .data jako tablicę Postów
function hasDataArray(x: unknown): x is { data: Post[] } {
	return !!x && typeof x === 'object' && Array.isArray((x as any).data);
}

export default async function PostDetailsPage(params: string[] = []): Promise<string> {
	const id = Number(params[0]);
	if (isNaN(id)) {
		return `<p class="text-red-500 text-center p-10">Invalid post ID</p>`;
	}

	const raw: unknown = await getAllPosts();

	let posts: Post[] = [];
	if (Array.isArray(raw)) {
		posts = raw as Post[];
	} else if (hasDataArray(raw)) {
		posts = raw.data;
	} else {
		return `<p class="text-red-500 text-center p-10">Error loading post</p>`;
	}

	const post = posts.find(p => Number((p as any).id) === id);
	if (!post) {
		return `<p class="text-red-500 text-center p-10">Post not found</p>`;
	}

	const relativeTime =
		DateTime.fromISO((post as any).createdAt || new Date().toISOString()).toRelative({
			locale: 'en',
		}) || 'just now';

	const isLiked = Boolean((post as any).isLiked);
	const likeBtnClass = isLiked ? 'text-pink-600 animate__animated animate__heartBeat' : 'text-pink-500';

	const likes = ((post as any)._count?.reactions ?? (post as any).reactions?.length ?? 0) as number;

	const commentsCount = ((post as any)._count?.comments ?? (post as any).comments?.length ?? 0) as number;

	const isFollowing = Boolean((post as any).isFollowing);
	const followBtnLabel = isFollowing ? 'Unfollow' : 'Follow';
	const followBtnClass = isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600';

	return `
  <div class="min-h-screen flex flex-col bg-gray-900 text-white">
    <div class="flex-grow flex items-center justify-center p-4 overflow-auto">
      <article class="max-w-2xl w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-gray-900 flex flex-col"
               style="min-height: 100%; max-height: 100vh;">

        <!-- Header -->
        <div class="flex items-center mb-6 justify-between">
          <div class="flex items-center">
            <div class="w-14 h-14 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center mr-4">
              <img
                src="${
									(post as any).media?.url
										? (post as any).media.url
										: `https://i.pravatar.cc/100?u=${(post as any).userId}`
								}"
                alt="${(post as any).author || `user${(post as any).userId}`}'s avatar"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">${(post as any).title}</h1>
              <p class="text-sm text-gray-500">
                ${relativeTime} • By 
                <span class="font-semibold">${(post as any).author || `@user${(post as any).userId}`}</span>
              </p>
            </div>
          </div>
          <button
            class="follow-btn text-white cursor-pointer px-3 py-1 rounded ${followBtnClass} text-sm font-semibold transition-colors"
            data-authorid="${(post as any).userId}"
            aria-label="${followBtnLabel} ${(post as any).author || `user${(post as any).userId}`}"
            type="button"
          >
            ${followBtnLabel}
          </button>
        </div>

        <!-- Image -->
        ${
					(post as any).media?.url
						? `<div class="mb-6 flex-shrink-0">
                <img
                  src="${(post as any).media.url}"
                  alt="${(post as any).media.alt || 'Post image'}"
                  class="w-full rounded-lg shadow-md max-h-[50vh] object-contain mx-auto"
                />
              </div>`
						: ''
				}

        <!-- Body -->
        <p class="text-gray-900 text-lg leading-relaxed mb-6 flex-grow overflow-auto">
          ${(post as any).body ?? ''}
        </p>

        <!-- Tags -->
        ${
					(post as any).tags?.length
						? `<div class="flex flex-wrap gap-3 mb-6">
                ${((post as any).tags as any[])
									.map(
										tag =>
											`<span class="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full cursor-default">#${tag}</span>`
									)
									.join('')}
              </div>`
						: ''
				}

        <!-- Footer -->
        <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
          <button
            class="like-btn flex items-center ${likeBtnClass} hover:text-pink-600 transition-colors"
            data-postid="${(post as any).id}"
            aria-pressed="${isLiked}"
            aria-label="Like post"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6 mr-2">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
            </svg>
            <span class="font-semibold text-lg like-count">${likes}</span>
          </button>

          <div class="flex items-center text-gray-600 text-sm cursor-pointer js-comments-count" role="button" tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="w-5 h-5 mr-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8l-4 4v-4H7a2 2 0 01-2-2v-2"/>
            </svg>
            <span class="comments-count">${commentsCount}</span>
          </div>

          <button id="back-to-feed" class="text-blue-600 hover:underline text-sm font-semibold cursor-pointer" type="button">
            ← Back to Feed
          </button>
        </div>

        <!-- Comments section -->
        <section id="comments-section" class="mt-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Comments</h2>
          <div id="comments-list" class="space-y-3">
            <div class="text-sm text-gray-500">Loading comments…</div>
          </div>
        </section>

        <!-- Comment form -->
        <form id="comment-form" class="mt-6">
          <textarea id="comment-text" placeholder="Write a comment..." required
            class="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"></textarea>
          <button type="submit"
            class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Post Comment
          </button>
        </form>

      </article>
    </div>
  </div>
  `;
}

/* -----------------------------
   INIT: bind Like, Comment & load list
------------------------------ */
export function initPostDetailsPageScripts() {
	const likeBtn = document.querySelector<HTMLButtonElement>('.like-btn');
	const likeCountEl = document.querySelector<HTMLSpanElement>('.like-count');
	const commentForm = document.getElementById('comment-form') as HTMLFormElement | null;
	const commentTextarea = document.getElementById('comment-text') as HTMLTextAreaElement | null;
	const commentsCountEl = document.querySelector<HTMLSpanElement>('.comments-count');
	const backBtn = document.getElementById('back-to-feed') as HTMLButtonElement | null;

	backBtn?.addEventListener('click', () => {
		window.location.assign('/feed');
	});

	const postId = getPostIdFromPage();
	if (postId) {
		loadAndRenderComments(postId);
	}

	// LIKE
	likeBtn?.addEventListener('click', async () => {
		if (!likeBtn || !likeCountEl) return;
		const postId = Number(likeBtn.dataset.postid);
		if (!postId) return;

		const isPressed = likeBtn.getAttribute('aria-pressed') === 'true';
		likeBtn.setAttribute('aria-pressed', (!isPressed).toString());
		likeBtn.classList.toggle('text-pink-600', !isPressed);
		likeBtn.classList.toggle('text-pink-500', isPressed);
		likeBtn.classList.add('animate__animated', 'animate__heartBeat');

		const current = Number(likeCountEl.textContent || '0');
		likeCountEl.textContent = String(current + (isPressed ? -1 : 1));

		try {
			await toggleHeartReaction(postId, !isPressed);
		} catch (err) {
			likeBtn.setAttribute('aria-pressed', isPressed.toString());
			likeBtn.classList.toggle('text-pink-600', isPressed);
			likeBtn.classList.toggle('text-pink-500', !isPressed);
			likeCountEl.textContent = String(current);
			console.error('Like failed:', err);
			alert('Could not update like. Please try again.');
		} finally {
			setTimeout(() => likeBtn.classList.remove('animate__animated', 'animate__heartBeat'), 600);
		}
	});

	// COMMENT
	commentForm?.addEventListener('submit', async e => {
		e.preventDefault();
		if (!commentTextarea || !commentsCountEl) return;

		const text = commentTextarea.value.trim();
		if (!text) return;

		const postId = getPostIdFromPage();
		if (!postId) return;

		const pendingId = `pending-${Date.now()}`;
		addCommentNode({
			id: pendingId,
			body: text,
			author: { name: 'You', avatar: `https://i.pravatar.cc/64?u=pending` },
			createdAt: new Date().toISOString(),
			pending: true,
		});

		const before = Number(commentsCountEl.textContent || '0');
		commentsCountEl.textContent = String(before + 1);
		commentTextarea.disabled = true;

		try {
			const saved = await addComment(postId, text);
			replacePendingCommentNode(pendingId, saved);
			commentTextarea.value = '';
		} catch (err) {
			console.error('Comment failed:', err);
			removeCommentNodeById(pendingId);
			const now = Number(commentsCountEl.textContent || '0');
			commentsCountEl.textContent = String(Math.max(0, now - 1));
			alert('Could not post comment. Please try again.');
		} finally {
			commentTextarea.disabled = false;
		}
	});
}

/* -------------------------------------------
   Comments helpers
-------------------------------------------- */
async function loadAndRenderComments(postId: number) {
	const listEl = document.getElementById('comments-list');
	if (!listEl) return;

	try {
		const comments = await fetchComments(postId);
		renderComments(comments);
	} catch (e) {
		listEl.innerHTML = `<div class="text-sm text-red-500">Failed to load comments.</div>`;
		console.error(e);
	}
}

async function fetchComments(postId: number): Promise<any[]> {
	const url = `${API_URL}/posts/${postId}/comments?_author=true&_sort=created`;
	const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
	if (!res.ok) throw new Error(`Comments load failed: ${res.status}`);
	const json = await res.json();
	// Noroff v2 zwykle zwraca { data: [...] }
	return Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];
}

function renderComments(comments: any[]) {
	const listEl = document.getElementById('comments-list');
	if (!listEl) return;

	if (!comments.length) {
		listEl.innerHTML = `<div class="text-sm text-gray-500">No comments yet.</div>`;
		return;
	}

	listEl.innerHTML = comments.map(c => commentHTML(c)).join('');
}

function commentHTML(c: any) {
	const authorName = c?.author?.name || c?.owner || c?.username || c?.author || 'anonymous';
	const avatar =
		c?.author?.avatar?.url || c?.author?.avatar || `https://i.pravatar.cc/64?u=${encodeURIComponent(authorName)}`;

	const when =
		(c?.created && DateTime.fromISO(c.created).toRelative({ locale: 'en' })) ||
		(c?.createdAt && DateTime.fromISO(c.createdAt).toRelative({ locale: 'en' })) ||
		'just now';

	const body = (c?.body ?? '').toString();

	const id = c?.id ?? '';
	const pendingBadge = c?.pending ? `<span class="ml-2 text-xs text-gray-400">(pending…)</span>` : '';

	return `
  <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-md" data-comment-id="${id}">
    <img src="${avatar}" alt="${authorName}'s avatar" class="w-8 h-8 rounded-full object-cover" />
    <div class="flex-1">
      <div class="text-sm text-gray-700">
        <span class="font-semibold">${escapeHTML(authorName)}</span>
        <span class="text-gray-400">•</span>
        <span class="text-gray-400">${when}</span>
        ${pendingBadge}
      </div>
      <p class="text-gray-800 text-sm mt-1 whitespace-pre-wrap">${escapeHTML(body)}</p>
    </div>
  </div>`;
}

function addCommentNode(localComment: {
	id: string;
	body: string;
	author: { name: string; avatar?: string };
	createdAt: string;
	pending?: boolean;
}) {
	const listEl = document.getElementById('comments-list');
	if (!listEl) return;

	// jeśli był "Loading…" lub "No comments yet." — wyczyść
	if (listEl.children.length === 1 && listEl.firstElementChild?.textContent?.match(/Loading|No comments/i)) {
		listEl.innerHTML = '';
	}

	const html = commentHTML({
		id: localComment.id,
		body: localComment.body,
		author: { name: localComment.author.name, avatar: localComment.author.avatar },
		createdAt: localComment.createdAt,
		pending: localComment.pending,
	});

	const wrapper = document.createElement('div');
	wrapper.innerHTML = html;
	const node = wrapper.firstElementChild as HTMLElement;
	// na górę listy
	listEl.prepend(node);
}

function replacePendingCommentNode(pendingId: string, savedFromApi: any) {
	const node = document.querySelector<HTMLElement>(`[data-comment-id="${pendingId}"]`);
	if (!node) return;

	const realId = savedFromApi?.id ?? pendingId;
	const html = commentHTML(savedFromApi ?? {});
	node.outerHTML = html.replace('data-comment-id=""', `data-comment-id="${realId}"`);
}

function removeCommentNodeById(id: string) {
	const node = document.querySelector<HTMLElement>(`[data-comment-id="${id}"]`);
	node?.remove();
}

/* -------------------------------------------
   API helpers
-------------------------------------------- */
function getPostIdFromPage(): number | null {
	const likeBtn = document.querySelector<HTMLButtonElement>('.like-btn');
	const id = likeBtn?.dataset.postid;
	return id ? Number(id) : null;
}

// Toggle HEART reaction (❤). true = like (PUT), false = unlike (DELETE)
async function toggleHeartReaction(postId: number, like: boolean) {
	const token = getToken();
	if (!token) throw new Error('No auth token');

	const heart = encodeURIComponent('❤');
	const url = `${API_URL}/posts/${postId}/react/${heart}`;

	const res = await fetch(url, {
		method: like ? 'PUT' : 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});

	if (!res.ok) {
		const t = await res.text().catch(() => '');
		throw new Error(`Reaction failed: ${res.status} ${t}`);
	}
	return res.json().catch(() => ({}));
}

// Dodaj komentarz do posta
async function addComment(postId: number, body: string) {
	const token = getToken();
	if (!token) throw new Error('No auth token');

	const url = `${API_URL}/posts/${postId}/comment`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ body }),
	});

	if (!res.ok) {
		const t = await res.text().catch(() => '');
		throw new Error(`Comment failed: ${res.status} ${t}`);
	}
	return res.json();
}

/* -------------------------------------------
   Utils
-------------------------------------------- */
function escapeHTML(s: string) {
	return s
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');
}
