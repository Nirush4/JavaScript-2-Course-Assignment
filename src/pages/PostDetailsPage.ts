import { getAllPosts } from '../services/posts/posts';
import { DateTime } from 'luxon';

export default async function PostDetailsPage(
  params: string[] = []
): Promise<string> {
  const id = Number(params[0]);
  if (isNaN(id)) {
    return `<p class="text-red-500 text-center p-10">Invalid post ID</p>`;
  }

  const data = await getAllPosts();

  let posts = [];

  if (Array.isArray(data)) {
    posts = data;
  } else if (data?.data && Array.isArray(data.data)) {
    posts = data.data;
  } else {
    return `<p class="text-red-500 text-center p-10">Error loading post</p>`;
  }

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return `<p class="text-red-500 text-center p-10">Post not found</p>`;
  }

  // Compute relativeTime using luxon (similar to postCard)
  const relativeTime =
    DateTime.fromISO(post.createdAt || new Date().toISOString()).toRelative({
      locale: 'en',
    }) || 'just now';

  // Like button classes based on isLiked state (assume false if not provided)
  const isLiked = post.isLiked ?? false;
  const likeBtnClass = isLiked
    ? 'text-pink-600 animate__animated animate__heartBeat'
    : 'text-pink-500';

  // Like count and comments count (from _count if available)
  const likes = post._count?.reactions ?? 0;
  const comments = post._count?.comments ?? 0;

  // Follow button (if you want to add this feature)
  const isFollowing = post.isFollowing ?? false;
  const followBtnLabel = isFollowing ? 'Unfollow' : 'Follow';
  const followBtnClass = isFollowing
    ? 'bg-red-500 hover:bg-red-600'
    : 'bg-blue-500 hover:bg-blue-600';

  return `
  <div class="min-h-screen flex flex-col bg-gray-900 text-white">
    <div class="flex-grow flex items-center justify-center p-4 overflow-auto">
      <article class="max-w-2xl w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-gray-900 flex flex-col"
             style="max-height: 90vh; min-height: 700px;">

        <!-- Header: Avatar & Author Info -->
        <div class="flex items-center mb-6 justify-between">
          <div class="flex items-center">
            <div class="w-14 h-14 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center mr-4">
              <img
                src="${
                  post.media?.url
                    ? post.media.url
                    : `https://i.pravatar.cc/100?u=${post.userId}`
                }"
                alt="${post.author || `user${post.userId}`}'s avatar"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">${post.title}</h1>
              <p class="text-sm text-gray-500">
                ${relativeTime} • By 
                <span class="font-semibold">${
                  post.author || `@user${post.userId}`
                }</span>
              </p>
            </div>
          </div>
          <!-- Follow / Unfollow Button -->
          <button
            class="follow-btn text-white cursor-pointer px-3 py-1 rounded ${followBtnClass} text-lg font-semibold transition-colors"
            data-authorid="${post.userId}"
            aria-label="${followBtnLabel} ${
    post.author || `user${post.userId}`
  }"
          >
            ${followBtnLabel}
          </button>
        </div>

        <!-- Post Image -->
        ${
          post.media?.url
            ? `<div class="mb-6 flex-shrink-0">
                <img
                  src="${post.media.url}"
                  alt="${post.media.alt || 'Post image'}"
                  class="w-full rounded-lg object-cover shadow-md max-h-[42vh] mx-auto"
                />
              </div>`
            : ''
        }

        <!-- Post Body -->
        <p class="text-gray-900 text-lg leading-relaxed mb-6 flex-grow overflow-auto">
          ${post.body}
        </p>

        <!-- Tags -->
        ${
          post.tags?.length
            ? `<div class="flex flex-wrap gap-3 mb-2">
                ${post.tags
                  .map(
                    (tag: any) =>
                      `<span class="bg-gray-100 text-gray-600 text-lg px-3 py-1 rounded-full cursor-default">#${tag}</span>`
                  )
                  .join('')}
              </div>`
            : ''
        }

        <!-- Footer: Likes, Comments & Back Link -->
        <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">

          <!-- Like Button -->
          <button
            class="like-btn flex items-center ${likeBtnClass} hover:text-pink-600 transition-colors"
            data-postid="${post.id}"
            aria-pressed="${isLiked}"
            aria-label="Like post"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
              class="w-6 h-6 mr-2"
            >
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
            </svg>
            <span class="font-semibold text-lg like-count">${likes}</span>
          </button>

          <!-- Comments count -->
          <div class="flex items-center text-gray-600 text-sm cursor-pointer" aria-label="View comments" role="button" tabindex="0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              viewBox="0 0 24 24" 
              class="w-5 h-5 mr-1"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8l-4 4v-4H7a2 2 0 01-2-2v-2"/>
            </svg>
            <span>${comments}</span>
          </div>

          <!-- Back to Feed Button -->
          <button
            id="back-to-feed"
            class="text-blue-600 hover:underline text-lg font-semibold cursor-pointer"
            type="button"
            aria-label="Back to feed"
          >
            ← Back to Feed
          </button>
        </div>

        <!-- Comment Form -->
        <form id="comment-form" class="mt-4">
          <textarea id="comment-text" placeholder="Write a comment..." required
            class="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"></textarea>
          <button type="submit"
            class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Post Comment
          </button>
        </form>

      </article>
    </div>
  </div>
  `;
}
