import { getAllPosts } from '../services/posts/posts';

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

  return `
  <div class="min-h-screen flex flex-col bg-gray-900 text-white">
    <div class="flex-grow flex items-center justify-center p-4 overflow-auto">
      <article class="max-w-2xl w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-gray-900 flex flex-col"
               style="min-height: 100%; max-height: 100vh;">

        <!-- Header: Avatar & Author Info -->
        <div class="flex items-center mb-6">
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
              ${post.relativeTime} • By 
              <span class="font-semibold">${post.author}</span>
            </p>
          </div>
        </div>

        <!-- Post Image -->
        ${
          post.media?.url
            ? `<div class="mb-6 flex-shrink-0">
                <img
                  src="${post.media.url}"
                  alt="${post.media.alt || 'Post image'}"
                  class="w-full rounded-lg shadow-md max-h-[50vh] object-contain mx-auto"
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
            ? `<div class="flex flex-wrap gap-3 mb-6">
                ${post.tags
                  .map(
                    (tag: any) =>
                      `<span class="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full cursor-default">#${tag}</span>`
                  )
                  .join('')}
              </div>`
            : ''
        }

        <!-- Footer: Likes and Back Link -->
        <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
          <button
            class="like-btn flex items-center text-pink-500 hover:text-pink-600 transition-colors animate__animated animate__pulse"
            data-postid="${post.id}"
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
            <span class="font-semibold text-lg">${post.likes}</span>
          </button>

          <!-- Back to Feed Button -->
          <button
            id="back-to-feed"
            class="text-blue-600 hover:underline text-sm font-semibold cursor-pointer"
            type="button"
            aria-label="Back to feed"
          >
            ← Back to Feed
          </button>
        </div>
      </article>
    </div>
  </div>
  `;
}
