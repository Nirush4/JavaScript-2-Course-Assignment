import type {
	ApiEnvelope,
	ProfileData,
	PostEnvelope,
	PostsEnvelope,
	CreatePostPayload,
	UpdatePostPayload,
} from './types';

const API_KEY_HEADER = 'X-Noroff-API-Key';


const API_BASE = (import.meta as any)?.env?.VITE_API_URL?.replace(/\/+$/, '') || 'https://v2.api.noroff.dev';


const join = (b: string, p: string) => `${b.replace(/\/+$/, '')}/${p.replace(/^\/+/, '')}`;


function readLS(key: string): string | null {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return null;
		
		return raw.trim().startsWith('"') ? JSON.parse(raw) : raw.trim();
	} catch {
		return null;
	}
}

function normalizeBearer(t: string | null | undefined): string | null {
	if (!t) return null;
	const s = t.trim();
	if (!s) return null;
	return s.startsWith('Bearer ') ? s.slice(7) : s;
}

function getApiKey(): string | null {
	const fromEnv = (import.meta as any)?.env?.VITE_API_KEY as string | undefined;
	if (fromEnv && fromEnv.trim()) return fromEnv.trim();

	const fromLS = readLS('apiKey');
	return fromLS && fromLS.trim() ? fromLS.trim() : null;
}

function getAccessToken(): string | null {
	const fromEnv = normalizeBearer((import.meta as any)?.env?.VITE_ACCESS_TOKEN as string | undefined);
	if (fromEnv) return fromEnv;

	const fromLS = readLS('accessToken');
	return normalizeBearer(fromLS);
}


export function setAccessToken(jwt: string) {
	localStorage.setItem('accessToken', JSON.stringify(jwt));
}
export function clearAccessToken() {
	localStorage.removeItem('accessToken');
}
export function setApiKey(key: string) {
	localStorage.setItem('apiKey', JSON.stringify(key));
}

export function getAuthInfo(): { name?: string; email?: string } | null {
	const t = getAccessToken();
	if (!t) return null;
	try {
		const [, payload] = t.split('.');
		const decoded = JSON.parse(atob(payload));
		return { name: decoded?.name, email: decoded?.email };
	} catch {
		return null;
	}
}

function buildHeaders(): Record<string, string> {
	const headers: Record<string, string> = { Accept: 'application/json' };

	const apiKey = getApiKey();
	if (apiKey) headers[API_KEY_HEADER] = apiKey;
	else console.warn('[api] Brak API key → X-Noroff-API-Key nie zostanie wysłany');

	const token = getAccessToken();
	if (token) headers.Authorization = `Bearer ${token}`;
	else console.warn('[api] Brak tokenu → Authorization nie zostanie wysłany');

	if ((import.meta as any)?.env?.DEV) {
	
		const authPreview = headers.Authorization ? headers.Authorization.slice(0, 20) + '…' : null;
		const keyPreview = headers[API_KEY_HEADER] ? '…' + headers[API_KEY_HEADER].slice(-6) : null;
		console.debug('[api] headers', { auth: authPreview, apiKey: keyPreview });
	}

	return headers;
}

async function httpGet<T>(endpoint: string): Promise<T> {
	const url = join(API_BASE, endpoint);
	const res = await fetch(url, { method: 'GET', headers: buildHeaders() });

	const ct = res.headers.get('content-type') || '';
	const isJson = ct.includes('application/json');

	if (!isJson) {
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		// @ts-expect-error 
		return null;
	}

	const data = await res.json();
	if (!res.ok) {
		const msg = data?.errors?.[0]?.message || data?.message || `HTTP ${res.status}`;
		throw new Error(msg);
	}
	return data as T;
}

async function httpSend<T>(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown): Promise<T> {
	const url = join(API_BASE, endpoint);
	const headers = buildHeaders();

	const init: RequestInit = { method, headers };
	if (method !== 'DELETE' && body !== undefined) {
		headers['Content-Type'] = 'application/json';
		init.body = JSON.stringify(body);
	}

	const res = await fetch(url, init);

	if (res.status === 204) {
		// @ts-expect-error:
		return null;
	}

	const ct = res.headers.get('content-type') || '';
	const isJson = ct.includes('application/json');
	const data = isJson ? await res.json() : {};

	if (!res.ok) {
		const msg = (data as any)?.errors?.[0]?.message || (data as any)?.message || `HTTP ${res.status}`;
		throw new Error(msg);
	}

	return data as T;
}

export const apiGetProfileByName = (name: string) =>
	httpGet<ApiEnvelope<ProfileData>>(`/social/profiles/${encodeURIComponent(name)}`);


export function apiGetDemoProfile(): ApiEnvelope<ProfileData> {
	return {
		data: {
			name: 'VooDoo',
			email: 'wojlez02882@stud.noroff.no',
			bio: null,
			avatar: {
				url: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400',
				alt: 'Avatar',
			},
			banner: {
				url: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500',
				alt: 'Banner',
			},
		},
		meta: {},
	};
}


export const apiGetPostsByAuthor = (name: string, limit = 12) =>
	httpGet<PostsEnvelope>(`/social/profiles/${encodeURIComponent(name)}/posts?limit=${limit}`);

export const apiCreatePost = (payload: CreatePostPayload) => httpSend<PostEnvelope>('/social/posts', 'POST', payload);

export const apiUpdatePost = (id: string | number, payload: UpdatePostPayload) =>
	httpSend<PostEnvelope>(`/social/posts/${id}`, 'PUT', payload);

export const apiDeletePost = (id: string | number) => httpSend<null>(`/social/posts/${id}`, 'DELETE');
