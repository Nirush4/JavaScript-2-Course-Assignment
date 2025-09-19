import type { Post } from "../../types/dummyjson-types";
import { DateTime } from "luxon";

/**
 * Instagram-like post card component
 * @param post Post object
 * @param animationDelay Animation delay in seconds (for animate.css) - use the index
 */
export default function postCard(
  {
    id,
    body = "The post you are looking for does not exist",
    reactions = { likes: 0, dislikes: 0 },
    tags = [],
    title = "No title available",
    userId = 0,
    createdAt = new Date().toISOString(),
  }: Post & { createdAt?: string },
  animationDelay = 0
) {
  // Instagram-like: show author, body, tags, likes, relative time, like button
  const author = `@user${userId}`;
  const likes = reactions.likes;
  const relativeTime =
    DateTime.fromISO(createdAt).toRelative({ locale: "en" }) || "just now";
  const paramsString = `id=${id}&author=${author}`;
  const searchParams = new URLSearchParams(paramsString);
  const detailsUrl = `/post-details.html?${searchParams.toString()}`;

  return `
    <article class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden animate__animated animate__fadeInUp animate__delay-${animationDelay}s mb-6" data-postid="${id}" data-component="postCard">
      <div class="flex items-center px-4 pt-4">
        <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
          <span class="text-gray-500 text-lg font-bold">${author
            .charAt(1)
            .toUpperCase()}</span>
        </div>
        <div>
          <span class="font-semibold text-gray-800">${author}</span>
          <span class="block text-xs text-gray-400">${relativeTime}</span>
        </div>
      </div>
      <div class="px-4 py-2">
        <h2 class="text-lg font-bold text-gray-800 mb-1">${title}</h2>
        <p class="text-gray-900 text-base mb-2">${body}</p>
        <div class="flex flex-wrap gap-2 mb-2">
          ${tags
            .map(
              (tag) =>
                `<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">#${tag}</span>`
            )
            .join("")}
        </div>
      </div>
      <div class="px-4 pb-4 flex items-center justify-between">
        <button class="like-btn flex items-center text-pink-500 hover:text-pink-600 transition-colors animate__animated animate__pulse" data-postid="${id}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" class="w-5 h-5 mr-1"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>
          <span class="font-semibold">${likes}</span>
        </button>
        <a href="${detailsUrl}" class="text-blue-500 text-xs hover:underline">View details</a>
      </div>
    </article>
  `;
}
