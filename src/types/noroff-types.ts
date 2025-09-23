export type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: { likes: number; dislikes: number }; // Added reactions
  userId: number; // Added userId
  views: number; // Added views
};
