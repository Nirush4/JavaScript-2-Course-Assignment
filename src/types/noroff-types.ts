export type ProfileMini = {
	name: string;
	email: string;
	avatar?: string | null;
};

export type Reaction = { symbol: string; count: number };

export type Comment = {
	id: number;
	postId: number;
	body: string;
	owner: string; 
	created: string; 
	author?: ProfileMini;
};

export type MediaMaybe = string | { url?: string | null; alt?: string | null } | null;

export type Post = {
	id: number;
	title?: string | null;
	body?: string | null;
	media?: MediaMaybe;
	created: string;
	author?: ProfileMini;
	_count?: { comments: number; reactions: number };
	reactions?: Reaction[];
	comments?: Comment[];
};
