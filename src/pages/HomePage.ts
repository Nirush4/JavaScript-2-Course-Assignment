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
  <div class="w-full h-full max-h-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pr-10">
    ${posts.map((post, index) => postCard(post, index)).join('')}
  </div>
`;
}
