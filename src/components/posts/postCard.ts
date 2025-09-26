import type { Post } from '../../types/noroff-types';
import { DateTime } from 'luxon';

/**
 * Instagram-like post card component
 * @param post Post object
 * @param animationDelay Animation delay in seconds (for animate.css) - use the index
 */
export default function postCard(
  {
    id,
    body = 'The post you are looking for does not exist',
    reactions,
    tags = [],
    title = 'No title available',
    userId = 0,
    createdAt = new Date().toISOString(),
    media = { url: '', alt: '' },
  }: Post & { createdAt?: string; media?: { url: string; alt: string } },
  animationDelay = 0
) {
  const author = `@user${userId}`;

  // Debug log to check reactions object
  console.log('post reactions:', reactions);

  // Safely get likes count, default to 0 if missing
  const likes = reactions?.likes ?? 0;

  const relativeTime =
    DateTime.fromISO(createdAt).toRelative({ locale: 'en' }) || 'just now';

  const detailsUrl = `/post/${id}`;

  return `
  <article 
    class="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden mb-6 flex flex-col h-[400px] animate__animated animate__fadeInUp animate__delay-${animationDelay}s" 
    data-postid="${id}" 
    data-component="postCard"
  >
    <!-- Header: Avatar & Author Info -->
    <div class="flex items-center px-4 pt-4">
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

    <!-- Footer: Like Button & Details Link -->
    <div class="px-4 pb-4 flex items-center justify-between">
      <button 
        class="like-btn flex items-center text-pink-500 hover:text-pink-600 transition-colors animate__animated animate__pulse" 
        data-postid="${id}"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          class="w-5 h-5 mr-1"
        >
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
        </svg>
        <span class="font-semibold">${likes}</span>
      </button>

      <a href="${detailsUrl}" data-link class="text-blue-500 text-m hover:underline pt-2">View details</a>
    </div>
  </article>
  `;
}
