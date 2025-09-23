import postCard from '../components/posts/postCard';
import { getAllPosts } from '../services/posts/posts';
import type { Post } from '../types/noroff-types'; // Ensure Post type is defined

export default async function HomePage(): Promise<string> {
  let posts: Post[] = [];

  try {
    const result = await getAllPosts();
    if (Array.isArray(result)) {
      posts = result;
    } else if (result?.data && Array.isArray(result.data)) {
      posts = result.data;
    } else {
      console.warn('Unexpected result from getAllPosts:', result);
    }
  } catch (error) {
    console.error('Error loading posts:', error);
  }

  return `
    <div class="flex gap-6 flex-wrap">
      ${posts.map((post, index) => postCard(post, index)).join('')}
    </div>
  `;
}
