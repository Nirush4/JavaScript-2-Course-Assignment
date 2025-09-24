

// function normalizeBearer(t: string) {
// 	const s = t.trim();
// 	return s.startsWith('Bearer ') ? s.slice(7) : s;
// }


// export function primeDevTokenAndKey(force = true) {
// 	const token = DEV_JWT ? normalizeBearer(DEV_JWT) : '';
// 	const key = DEV_KEY || '';

// 	if (!token) console.warn('[profile] Brak DEV tokenu');
// 	if (!key) console.warn('[profile] Brak DEV API KEY');

// 	if (token && (force || !localStorage.getItem('accessToken'))) {
// 		localStorage.setItem('accessToken', JSON.stringify(token));
// 		console.info('[profile] DEV token saved to localStorage');
// 	}
// 	if (key && (force || !localStorage.getItem('apiKey'))) {
// 		localStorage.setItem('apiKey', JSON.stringify(key));
// 		console.info('[profile] DEV API key saved to localStorage');
// 	}
// }
