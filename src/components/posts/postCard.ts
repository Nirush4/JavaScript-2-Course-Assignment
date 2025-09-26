import type { Post } from '../../types/noroff-types';
import { DateTime } from 'luxon';

export default function postCard(
  {
    id,
    body = 'The post you are looking for does not exist',
    tags = [],
    title = 'No title available',
    userId = 0,
    createdAt = new Date().toISOString(),
    media = { url: '', alt: '' },
    isFollowing = false, // Add this boolean to indicate following status for author
    _count = { reactions: 0, comments: 0 }, // destructure counts here
    isLiked = false, // New prop: whether current user liked this post
  }: Post & {
    createdAt?: string;
    media?: { url: string; alt: string };
    isFollowing?: boolean;
    _count?: { reactions: number; comments: number };
    isLiked?: boolean;
  },
  animationDelay = 0
) {
  const author = `@user${userId}`;

  // Use _count from API response for likes and comments
  const likes = _count?.reactions ?? 0;
  const comments = _count?.comments ?? 0;

  const relativeTime =
    DateTime.fromISO(createdAt).toRelative({ locale: 'en' }) || 'just now';

  const detailsUrl = `/post/${id}`;

  const followBtnLabel = isFollowing ? 'Unfollow' : 'Follow';
  const followBtnClass = isFollowing
    ? 'bg-red-500 hover:bg-red-600'
    : 'bg-blue-500 hover:bg-blue-600';

  const animationDelayClass =
    animationDelay > 0 ? `animate__delay-${animationDelay}s` : '';

  // Like button classes & aria-pressed based on isLiked state
  const likeBtnClass = isLiked
    ? 'text-pink-600 animate__animated animate__heartBeat'
    : 'text-pink-500';

  return `
  <article 
    class="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden mb-6 flex flex-col h-[400px] animate__animated animate__fadeInUp ${animationDelayClass}" 
    data-postid="${id}" 
    data-authorid="${userId}"
    data-component="postCard"
  >
    <!-- Header: Avatar & Author Info -->
    <div class="flex items-center px-4 pt-4 justify-between">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center mr-3">
          <img 
            src="https://i.pravatar.cc/100?u=${userId}" 
            alt="${author}'s avatar" 
            class="w-full h-full object-cover" 
          />
        </div>
        <div>
          <span class="font-semibold text-gray-800">${author}</span>
          <span class="block text-xs text-gray-400">${relativeTime}</span>
        </div>
      </div>

      <!-- Follow / Unfollow Button -->
      <button
        class="follow-btn text-white cursor-pointer px-3 py-1 rounded ${followBtnClass} text-sm font-semibold transition-colors"
        data-authorid="${userId}"
        aria-label="${followBtnLabel} ${author}"
      >
        ${followBtnLabel}
      </button>
    </div>

    <!-- Body: Title, Image, Body, Tags -->
    <div class="px-4 py-2 flex-grow overflow-y-auto">
      <h2 class="text-lg font-bold text-gray-800 mb-2">${title}</h2>

      ${
        media?.url
          ? `
          <div class="mb-3">
            <img 
              src="${media.url}" 
              alt="${media.alt || 'Post image'}" 
              class="w-full h-auto rounded" 
            />
          </div>
        `
          : ''
      }

      <p class="text-gray-900 text-base mb-3">${body}</p>

      ${
        tags?.length
          ? `
        <div class="flex flex-wrap gap-2 mb-3">
          ${tags
            .map(
              (tag) =>
                `<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">#${tag}</span>`
            )
            .join('')}
        </div>
      `
          : ''
      }
    </div>

    <!-- Footer: Like Button & Comments count -->
    <div class="px-4 pb-4 flex items-center justify-between">
      <button 
        class="like-btn flex items-center ${likeBtnClass} hover:text-pink-600 transition-colors" 
        data-postid="${id}"
        aria-pressed="${isLiked}"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          class="w-5 h-5 mr-1"
        >
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
        </svg>
        <span class="font-semibold like-count">${likes}</span>
      </button>

      <div class="flex items-center text-gray-600 text-sm">
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

      <a href="${detailsUrl}" data-link class="text-blue-500 text-m hover:underline pt-2 ml-4">View details</a>
    </div>
  </article>
  `;
}
