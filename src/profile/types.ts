export interface Media {
	url: string;
	alt?: string | null;
}

export interface ProfileData {
	name: string;
	email?: string | null;
	bio?: string | null;
	avatar?: Media | null;
	banner?: Media | null;
}

export interface ApiEnvelope<T> {
	data: T;
	meta?: Record<string, unknown>;
}

export interface Post {
	id: string | number;
	title: string;
	body?: string | null;
	media?: Media | null;
	created?: string;
}

export interface PostEnvelope extends ApiEnvelope<Post> {}
export interface PostsEnvelope extends ApiEnvelope<Post[]> {}

export interface CreatePostPayload {
	title: string;
	body?: string;
	media?: Media;
}

export interface UpdatePostPayload extends Partial<CreatePostPayload> {}
