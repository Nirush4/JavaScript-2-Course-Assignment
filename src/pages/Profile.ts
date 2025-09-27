import { api, post, put, del, getToken } from '../services/api/client';
import { renderRoute } from '../router';

/* ------------------------ utils ------------------------ */
function getUsername(): string | null {
  const n1 = localStorage.getItem('name');
  if (n1) {
    try {
      return JSON.parse(n1);
    } catch {
      return n1;
    }
  }
  const n2 = localStorage.getItem('username');
  if (n2) {
    try {
      return JSON.parse(n2);
    } catch {
      return n2;
    }
  }
  const t = getToken();
  if (!t) return null;
  try {
    const payload = JSON.parse(atob((t.split('.')[1] || '') as string));
    if (payload && typeof payload.name === 'string') return payload.name;
  } catch {}
  return null;
}

function escHtml(v: any) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

type ProfileResponse = {
  name: string;
  avatar?: { url?: string; alt?: string } | string;
  bio?: string;
  _count?: { followers?: number; following?: number; posts?: number };
  followers?: any[];
  following?: any[];
};

type PostItem = {
  id: number;
  title: string;
  body?: string;
  tags?: string[];
  media?:
    | { url?: string; alt?: string }
    | Array<{ url?: string; alt?: string }>;
  author?: { name?: string };
  created?: string;
  updated?: string;
};

/* ------------------------ view ------------------------ */
export default async function ProfilePage(): Promise<string> {
  const username = getUsername();
  if (!username) {
    return `
      <main class="min-h-dvh bg-gray-900 text-gray-100 p-8">
        <h1 class="text-3xl font-bold mb-6">Your Profile</h1>
        <p class="opacity-80">
          Brak nazwy użytkownika. Zaloguj się ponownie lub zapisz:
          <code>localStorage.setItem('name', JSON.stringify('TwojaNazwa'))</code>
        </p>
        <a class="inline-block mt-6 underline" href="/login">→ Go to Login</a>
      </main>
    `;
  }

  // 1) Profil
  let profile: ProfileResponse;
  try {
    profile = await api<ProfileResponse>(
      `/profiles/${encodeURIComponent(username)}`
    );
  } catch (err: any) {
    return `
      <main class="min-h-dvh bg-gray-900 text-gray-100 p-8">
        <h1 class="text-3xl font-bold mb-6">Your Profile</h1>
        <div class="p-4 rounded bg-red-900/30 border border-red-700">
          <div class="font-semibold mb-1">Error loading profile</div>
          <code class="text-sm break-all">${escHtml(
            err?.message ?? String(err)
          )}</code>
        </div>
        <p class="mt-4 opacity-80">Sprawdź token / API key.</p>
      </main>
    `;
  }

  // 2) Post
  let posts: PostItem[] = [];
  try {
    const res = await api<any>(
      `/profiles/${encodeURIComponent(
        username
      )}/posts?limit=50&sort=created&sortOrder=desc`
    );
    posts = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  } catch {
    posts = [];
  }

  const displayName = profile?.name ?? username;
  const avatar =
    (typeof profile?.avatar === 'string'
      ? profile.avatar
      : profile?.avatar?.url) || '/profile.avif';
  const followers =
    profile?._count?.followers ?? profile?.followers?.length ?? 0;
  const following =
    profile?._count?.following ?? profile?.following?.length ?? 0;
  const postsCount = posts.length;
  const bio = profile?.bio || '';

  // 3) HTML
  const html = `
    <main class="min-h-dvh bg-gray-900 text-gray-100 px-4 sm:px-6 py-6">
      <!-- Top card (centered) -->
      <header class="max-w-3xl mx-auto rounded-2xl border border-gray-800 bg-gray-850/60 p-6 shadow mb-8">
        <div class="flex flex-col items-center text-center gap-4">
          <img src="${escHtml(avatar)}" alt="Avatar"
               class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-gray-700"/>
          <div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${escHtml(
              displayName
            )}</h1>
            <p class="opacity-80 text-sm sm:text-base mt-2">${
              bio ? escHtml(bio) : '—'
            }</p>
            <div class="mt-3 text-xs sm:text-sm opacity-80 flex items-center justify-center gap-3">
              <span>Followers: <b>${followers}</b></span>
              <span>Following: <b>${following}</b></span>
              <span>Posts: <b>${postsCount}</b></span>
            </div>

            <!-- New Post under stats -->
            <div class="mt-4">
              <button id="toggle-create"
                      class="px-4 py-2 rounded-lg border border-blue-500/40 text-blue-100
                             hover:bg-blue-600/20 hover:border-blue-500 transition">
                New Post
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Editor Card -->
      <section id="editor" class="max-w-2xl mx-auto hidden">
        <div class="rounded-xl border border-gray-800 bg-gray-850/60 backdrop-blur p-4 sm:p-5 shadow-lg">
          <h2 id="editor-title" class="text-lg sm:text-xl font-semibold mb-3">Create a new post</h2>
          <form id="post-form" class="space-y-4">
            <input type="hidden" id="postId" value="">
            <div>
              <label class="block mb-1 text-sm">Title <span class="text-red-400">*</span></label>
              <input id="title" required
                     class="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block mb-1 text-sm">Body</label>
              <textarea id="body" rows="6"
                        class="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block mb-1 text-sm">Image URL</label>
                <input id="imgUrl"
                       class="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500"
                       placeholder="https://..." />
              </div>
              <div>
                <label class="block mb-1 text-sm">Image ALT</label>
                <input id="imgAlt"
                       class="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label class="block mb-1 text-sm">Tags (comma separated)</label>
              <input id="tags"
                     class="w-full p-2 rounded border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500"
                     placeholder="news, cats" />
            </div>
            <div class="flex items-center gap-3 pt-1">
              <button type="submit" id="save-btn" class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500">Create</button>
              <button type="button" id="cancel-edit" class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">Cancel</button>
              <button type="button" id="reset-edit" class="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700">Reset</button>
              <span id="msg" class="text-sm opacity-80 ml-1"></span>
            </div>
          </form>
        </div>
      </section>

      <!-- Posts -->
      <section class="max-w-6xl mx-auto mt-8">
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gray-800 border border-gray-700">🗂️</span>
          <h2 class="text-lg sm:text-xl font-semibold">Your posts</h2>
        </div>
        <div id="posts" class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          ${
            posts.length
              ? posts
                  .map((p) => {
                    const media = Array.isArray(p.media)
                      ? p.media?.[0]?.url
                      : (p.media as any)?.url;
                    const own = p.author?.name === profile.name;
                    const created = p.created
                      ? new Date(p.created).toLocaleString()
                      : '';
                    const tags =
                      Array.isArray(p.tags) && p.tags.length
                        ? `<div class="flex flex-wrap gap-1 mt-2">${p.tags
                            .slice(0, 5)
                            .map(
                              (t) =>
                                `<span class="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700">${escHtml(
                                  t
                                )}</span>`
                            )
                            .join('')}</div>`
                        : '';
                    return `
                    <article class="rounded-xl bg-gray-850/60 border border-gray-800 p-4 hover:border-gray-700 transition shadow">
                      ${
                        media
                          ? `<img class="w-full h-44 object-cover rounded-md mb-3 border border-gray-800" src="${escHtml(
                              media
                            )}" alt="">`
                          : ''
                      }
                      <h3 class="font-semibold mb-1">${escHtml(p.title)}</h3>
                      <div class="text-xs opacity-60 mb-2">${escHtml(
                        created
                      )}</div>
                      <div class="text-sm opacity-90 line-clamp-3">${escHtml(
                        p.body ?? ''
                      )}</div>
                      ${tags}
                      ${
                        own
                          ? `<div class="flex gap-2 mt-3">
                               <button class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 js-edit" data-id="${p.id}">Edit</button>
                               <button class="px-3 py-1 rounded bg-red-600 hover:bg-red-500 js-delete" data-id="${p.id}">Delete</button>
                             </div>`
                          : ''
                      }
                    </article>
                  `;
                  })
                  .join('')
              : `<p class="opacity-70">No posts yet.</p>`
          }
        </div>
      </section>

      <div class="max-w-6xl mx-auto"><a 
  href="/feed" 
  class="inline-block mt-10 underline text-gray-400 hover:text-gray-200 transition"> 
  <a class="inline-block mt-10 underline hover:text-blue-800 text-lg"  href="/feed">← Back to Feed</a>
      </div>
    </main>
  `;

  // 4) Zachowanie – delegacja globalna
  wireProfileHandlersOnce();

  return html;
}

/* ------------------------ behavior ------------------------ */
function q<T extends Element = Element>(sel: string): T | null {
  return document.querySelector<T>(sel);
}

function openCreate() {
  const editor = q<HTMLDivElement>('#editor');
  const editorTitle = q<HTMLHeadingElement>('#editor-title');
  const hiddenId = q<HTMLInputElement>('#postId');
  const saveBtn = q<HTMLButtonElement>('#save-btn');
  const msg = q<HTMLParagraphElement>('#msg');
  const titleEl = q<HTMLInputElement>('#title');
  const bodyEl = q<HTMLTextAreaElement>('#body');
  const imgUrlEl = q<HTMLInputElement>('#imgUrl');
  const imgAltEl = q<HTMLInputElement>('#imgAlt');
  const tagsEl = q<HTMLInputElement>('#tags');

  editor?.classList.remove('hidden');
  if (editorTitle) editorTitle.textContent = 'Create a new post';
  if (saveBtn) saveBtn.textContent = 'Create';
  if (hiddenId) hiddenId.value = '';
  if (msg) msg.textContent = '';
  if (titleEl) titleEl.value = '';
  if (bodyEl) bodyEl.value = '';
  if (imgUrlEl) imgUrlEl.value = '';
  if (imgAltEl) imgAltEl.value = '';
  if (tagsEl) tagsEl.value = '';
  titleEl?.focus();
}

function openEdit(post: any) {
  const editor = q<HTMLDivElement>('#editor');
  const editorTitle = q<HTMLHeadingElement>('#editor-title');
  const hiddenId = q<HTMLInputElement>('#postId');
  const saveBtn = q<HTMLButtonElement>('#save-btn');
  const msg = q<HTMLParagraphElement>('#msg');

  const form = q<HTMLFormElement>('#post-form');
  const titleEl = q<HTMLInputElement>('#title');
  const bodyEl = q<HTMLTextAreaElement>('#body');
  const imgUrlEl = q<HTMLInputElement>('#imgUrl');
  const imgAltEl = q<HTMLInputElement>('#imgAlt');
  const tagsEl = q<HTMLInputElement>('#tags');

  editor?.classList.remove('hidden');
  if (editorTitle) editorTitle.textContent = `Edit post #${post.id}`;
  if (saveBtn) saveBtn.textContent = 'Save changes';
  if (hiddenId) hiddenId.value = String(post.id);
  if (msg) msg.textContent = '';

  const media = Array.isArray(post.media) ? post.media?.[0] : post.media || {};
  const original = {
    id: post?.id ?? '',
    title: post?.title ?? '',
    body: post?.body ?? '',
    imgUrl: media?.url ?? '',
    imgAlt: media?.alt ?? '',
    tags: Array.isArray(post?.tags) ? post.tags : [],
  };

  // Prefill
  if (titleEl) titleEl.value = original.title;
  if (bodyEl) bodyEl.value = original.body;
  if (imgUrlEl) imgUrlEl.value = original.imgUrl;
  if (imgAltEl) imgAltEl.value = original.imgAlt;
  if (tagsEl) tagsEl.value = original.tags.join(', ');

  if (form) (form as any).dataset.original = JSON.stringify(original);

  titleEl?.focus();
}

function closeEditor() {
  const editor = q<HTMLDivElement>('#editor');
  const hiddenId = q<HTMLInputElement>('#postId');
  const msg = q<HTMLParagraphElement>('#msg');
  editor?.classList.add('hidden');
  if (hiddenId) hiddenId.value = '';
  if (msg) msg.textContent = '';
}

function wireProfileHandlersOnce() {
  if ((window as any).__profileHandlersWired) return;
  (window as any).__profileHandlersWired = true;

  document.addEventListener('click', async (e) => {
    const el = e.target as HTMLElement;

    // Toggle editor
    if (el.closest('#toggle-create')) {
      const editor = q<HTMLDivElement>('#editor');
      if (!editor) return;
      if (editor.classList.contains('hidden')) openCreate();
      else closeEditor();
      return;
    }

    // Cancel
    if (el.closest('#cancel-edit')) {
      if (!q('#editor')) return;
      closeEditor();
      return;
    }

    // Reset (przy edycji)
    if (el.closest('#reset-edit')) {
      const form = q<HTMLFormElement>('#post-form');
      if (!form?.dataset.original) return;
      const data = JSON.parse(form.dataset.original);
      const titleEl = q<HTMLInputElement>('#title');
      const bodyEl = q<HTMLTextAreaElement>('#body');
      const imgUrlEl = q<HTMLInputElement>('#imgUrl');
      const imgAltEl = q<HTMLInputElement>('#imgAlt');
      const tagsEl = q<HTMLInputElement>('#tags');

      if (titleEl) titleEl.value = data.title || '';
      if (bodyEl) bodyEl.value = data.body || '';
      if (imgUrlEl) imgUrlEl.value = data.imgUrl || '';
      if (imgAltEl) imgAltEl.value = data.imgAlt || '';
      if (tagsEl)
        tagsEl.value = Array.isArray(data.tags) ? data.tags.join(', ') : '';
      return;
    }

    // Edit
    const editBtn = el.closest('.js-edit') as HTMLButtonElement | null;
    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      if (!id) return;
      try {
        const res = await api<any>(
          `/posts/${id}?_author=true&_reactions=true&_comments=true`
        );
        const p = res?.data ?? res;
        openEdit({
          id: p?.id ?? id,
          title: p?.title ?? '',
          body: p?.body ?? '',
          tags: Array.isArray(p?.tags) ? p.tags : [],
          media: p?.media ?? null,
        });
      } catch {
        alert('Failed to load post for edit');
      }
      return;
    }
    // Delete
    const delBtn = el.closest('.js-delete') as HTMLButtonElement | null;
    if (delBtn) {
      const id = delBtn.getAttribute('data-id');
      if (!id) return;
      if (!confirm('Delete this post? This cannot be undone.')) return;
      try {
        await del(`/posts/${id}`);
        renderRoute('/profile');
      } catch (err: any) {
        alert(`Delete failed: ${err?.message ?? String(err)}`);
      }
      return;
    }
  });

  // Create / Update
  document.addEventListener('submit', async (e) => {
    const form = e.target as HTMLFormElement;
    if (form?.id !== 'post-form') return;
    e.preventDefault();

    const saveBtn = q<HTMLButtonElement>('#save-btn');
    const msg = q<HTMLParagraphElement>('#msg');
    const hiddenId = q<HTMLInputElement>('#postId');
    const titleEl = q<HTMLInputElement>('#title');
    const bodyEl = q<HTMLTextAreaElement>('#body');
    const imgUrlEl = q<HTMLInputElement>('#imgUrl');
    const imgAltEl = q<HTMLInputElement>('#imgAlt');
    const tagsEl = q<HTMLInputElement>('#tags');

    if (!titleEl || !saveBtn || !msg) return;

    const id = hiddenId?.value?.trim();
    const title = titleEl.value.trim();
    const body = bodyEl?.value?.trim() || '';
    const imgUrl = imgUrlEl?.value?.trim() || '';
    const imgAlt = imgAltEl?.value?.trim() || '';
    const tagsRaw = tagsEl?.value?.trim() || '';
    const tags = tagsRaw
      ? tagsRaw
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    if (!title) {
      msg.textContent = 'Title is required.';
      return;
    }

    const payload: any = { title };
    if (body) payload.body = body;
    if (tags.length) payload.tags = tags;
    payload.media = imgUrl
      ? { url: imgUrl, ...(imgAlt ? { alt: imgAlt } : {}) }
      : null;

    try {
      saveBtn.disabled = true;
      saveBtn.textContent = id ? 'Saving…' : 'Creating…';
      msg.textContent = '';

      if (id) await put(`/posts/${id}`, payload);
      else await post('/posts', payload);

      renderRoute('/profile');
    } catch (err: any) {
      msg.textContent = `Error: ${err?.message ?? String(err)}`;
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = id ? 'Save changes' : 'Create';
    }
  });
}
