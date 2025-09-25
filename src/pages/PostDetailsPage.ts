import { getAllPosts } from '../services/posts/posts';

export default async function PostDetailsPage(
  params: string[] = []
): Promise<string> {
  console.log('PostDetailsPage params:', params); // Debug

  const id = Number(params[0]);
  if (isNaN(id)) {
    return `<p>Invalid post ID</p><a href="/posts" data-link>Back to posts</a>`;
  }

  const data = await getAllPosts();

  const post = data.posts.find((p) => p.id === id);

  if (!post) {
    return `<p>Post not found</p><a href="/posts" data-link>Back to posts</a>`;
  }

  return `
    <section class="post-details">
      <h1>${post.title}</h1>
      <p><strong>Author:</strong> @user${post.userId}</p>
      <p>${post.body}</p>
      <p><strong>Likes:</strong> ${post.reactions.likes}</p>
      <p><strong>Tags:</strong> ${post.tags.map((t) => `#${t}`).join(', ')}</p>
      ${
        post.media?.url
          ? `<img src="${post.media.url}" alt="${
              post.media.alt || ''
            }" style="max-width: 100%;" />`
          : ''
      }
      <button id="back-button">Back to posts</button>
    </section>
  `;
}
