import type { Post, PostsResponse } from "../../types/dummyjson-types";
import { get } from "../api/client";

const postsApiEndpoint = "/posts";

/**
 * Fetches all posts.
 * @returns {Promise<Array>} A promise that resolves to an array of posts.
 */
export async function getAllPosts(): Promise<PostsResponse> {
  const data = await get<PostsResponse>(postsApiEndpoint);
  return data;
}

/**
 * Fetches a single post by its ID.
 * @param {string|number} id The ID of the post to fetch.
 * @returns {Promise<Object>} A promise that resolves to the post object.
 */
export async function getPostById(id: Post["id"]): Promise<Post> {
  const data = await get<Post>(`${postsApiEndpoint}/${id}`);
  return data;
}
