export interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  likedBy: Set<string>;
}
