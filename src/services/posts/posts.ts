import type { Post } from '../../types/noroff-types';
import { get, post } from '../api/client';

interface PostsResponse {
  data: Post[];
  // other fields if needed
}

const postsApiEndpoint = '/posts';

/**
 * Fetches all posts.
 * @returns {Promise<PostsResponse>} A promise that resolves to an array of posts.
 */
export async function getAllPosts(): Promise<PostsResponse> {
  const data = await get<PostsResponse>(postsApiEndpoint);

  const filteredData = {
    ...data,
    data: data.data.filter(
      (post) =>
        post.media &&
        typeof post.media.url === 'string' &&
        post.media.url.trim() !== ''
    ),
  };

  return filteredData;
}

/**
 * Fetches a single post by its ID.
 * @param {string|number} id The ID of the post to fetch.
 * @returns {Promise<Post>} A promise that resolves to the post object.
 */
export async function getPostById(id: Post['id']): Promise<Post> {
  const data = await get<Post>(`${postsApiEndpoint}/${id}`);
  return data;
}

// New interface for comment payload
interface CommentPayload {
  comment: string;
}

/**
 * Posts a comment to a specific post.
 * @param {string} postId The ID of the post to comment on.
 * @param {string} comment The comment text.
 * @returns {Promise<any>} The response from the API.
 */
export async function postComment(postId: string, comment: string) {
  const endpoint = `/social/posts/${postId}/comment`;
  const body: CommentPayload = { comment };
  return post(endpoint, body);
}
