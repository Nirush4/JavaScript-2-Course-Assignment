

const DEV_JWT = (import.meta as any)?.env?.VITE_DEV_JWT ?? '';
const DEV_KEY = (import.meta as any)?.env?.VITE_DEV_KEY ?? '';

export function primeDevTokenAndKey(enable = false): void {
	if (!enable) return;
	if (DEV_JWT) localStorage.setItem('accessToken', JSON.stringify(String(DEV_JWT).trim()));
	if (DEV_KEY) localStorage.setItem('apiKey', JSON.stringify(String(DEV_KEY).trim()));
}
