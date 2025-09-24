const KEY = 'profileAssetVersion';

export function getAssetVersion(): number {
	const v = Number(localStorage.getItem(KEY) || '0');
	return Number.isFinite(v) ? v : 0;
}

export function bumpAssetVersion(): number {
	const v = getAssetVersion() + 1;
	localStorage.setItem(KEY, String(v));
	window.dispatchEvent(new CustomEvent('profile:assetVersion', { detail: v }));
	return v;
}

export function withVer(url?: string | null): string {
	if (!url) return '';
	const v = getAssetVersion();
	const sep = url.includes('?') ? '&' : '?';
	return `${url}${sep}v=${v}`;
}
