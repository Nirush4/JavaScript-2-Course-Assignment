import postCard from "../components/posts/postCard";
import { getAllPosts } from "../services/posts/posts";

export default async function HomePage() {
  const { posts } = await getAllPosts();

  return `
    <div class="flex gap-6 flex-wrap">
      ${posts.map((post, index) => postCard({ ...post }, index)).join("")}
    </div>
  `;
}
