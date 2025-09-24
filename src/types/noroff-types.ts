export interface Post {
  media: { url: string; alt: string }; // Ensure media is defined with url and alt properties
  body: string;
  id: number;
  reactions: { likes: number; dislikes: number }; // Added reactions
  tags: string[];
  title: string;
  userId: number;
  views: number;
}
