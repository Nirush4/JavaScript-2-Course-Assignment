import { getToken } from './client';

const API_URL = 'https://v2.api.noroff.dev/social';

/**
 * Fetch a profile including the list of followed users.
 */
export async function getProfileWithFollowing(username: string) {
  const token = localStorage.getItem('accessToken') || getToken();
  const key = localStorage.getItem('apiKey');
  if (!token) {
    console.warn('⚠️ No token found — cannot fetch profile');
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/profiles/${username}?_following=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': `${key}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`❌ Failed to fetch profile for ${username}: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('Error fetching profile with following:', err);
    return null;
  }
}

/**
 * Follow a user (PUT /follow)
 */
export async function followUser(username: string): Promise<boolean> {
  const token = localStorage.getItem('accessToken') || getToken();
  const key = localStorage.getItem('apiKey');

  if (!token) {
    console.warn('⚠️ No token found — cannot follow user');
    return false;
  }

  try {
    const res = await fetch(`${API_URL}/profiles/${username}/follow`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': `${key}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`❌ Follow failed for ${username}: ${res.status}`);
      return false;
    }

    console.log(`✅ Successfully followed ${username}`);
    return true;
  } catch (err) {
    console.error('Follow request failed:', err);
    return false;
  }
}

export async function unfollowUser(username: string): Promise<boolean> {
  const token = localStorage.getItem('accessToken') || getToken();
  const key = localStorage.getItem('apiKey');

  if (!token) {
    console.warn('⚠️ No token found — cannot unfollow user');
    return false;
  }
  try {
    const res = await fetch(`${API_URL}/profiles/${username}/Unfollow`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': `${key}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`❌ Unfollow failed for ${username}: ${res.status}`);
      return false;
    }

    console.log(`✅ Successfully unfollowed ${username}`);
    return true;
  } catch (err) {
    console.error('Unfollow request failed:', err);
    return false;
  }
}
