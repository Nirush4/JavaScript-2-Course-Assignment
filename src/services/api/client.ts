import { API_URL } from '../../constants';
import { getLocalItem } from '../../utils/storage';
import { ApiError } from '../error/error';

interface ApiClientOptions extends RequestInit {
  body?: BodyInit | null | undefined | string;
}

type Endpoint = string;

const API_KEY_HEADER = 'X-Noroff-API-Key';

async function apiClient(endpoint: string, options: ApiClientOptions = {}) {
  const { body, ...customOptions } = options;

  const headers: Record<string, string> = {};

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customOptions,
    headers: {
      ...headers,
      ...(customOptions.headers as Record<string, string>),
    },
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
      (config.headers as Record<string, string>)['Content-Type'] =
        'application/json';
    }
  }

  const apiKey = getLocalItem<string>('apiKey');
  const accessToken = getLocalItem<string>('accessToken');

  debugger;
  if (apiKey) {
    (config.headers as Record<string, string>)[API_KEY_HEADER] = apiKey;
  }

  if (accessToken) {
    (config.headers as Record<string, string>)[
      'Authorization'
    ] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(API_URL + endpoint, config);
    const contentType = response.headers.get('content-type');

    debugger;
    if (
      response.status === 204 ||
      !contentType ||
      !contentType.includes('application/json')
    ) {
      if (!response.ok) {
        throw new ApiError(`HTTP Error: ${response.status}`, response.status);
      }
      return null;
    }

    let responseData = await response.json();

    if (Array.isArray(responseData)) {
      responseData = responseData.filter((media) => media.url !== '');
    }

    if (!response.ok) {
      const message =
        responseData.errors?.[0]?.message || `HTTP Error: ${response.status}`;
      throw new ApiError(message, response.status);
    }
    return responseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error('A network or client error occurred.');
  }
}

// Helper to build query string from params
function buildQuery(params: Record<string, any>) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
}

// Exported helpers
export const get = <T = unknown>(endpoint: Endpoint): Promise<T> =>
  apiClient(endpoint);

export const post = <T>(endpoint: Endpoint, body: T) =>
  apiClient(endpoint, { body: JSON.stringify(body) });

export const put = <T>(endpoint: Endpoint, body: T) =>
  apiClient(endpoint, { method: 'PUT', body: JSON.stringify(body) });

export const del = (endpoint: Endpoint) =>
  apiClient(endpoint, { method: 'DELETE' });

// New: Pagination support for getting posts
interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: any; // extra filters if needed
}

export const getPosts = <T = unknown>(
  paginationParams: PaginationParams = {}
): Promise<T> => {
  const query = buildQuery(paginationParams);
  const endpoint = `/posts${query ? `?${query}` : ''}`;
  return get<T>(endpoint);
};

export async function loginUser(data: { email: string; password: string }) {
  const response = await fetch('https://v2.api.noroff.dev/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function fetchApiKey(
  accessToken: string
): Promise<string | undefined> {
  const response = await fetch(
    'https://v2.api.noroff.dev/auth/create-api-key',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch API key: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  return data?.data?.key;
}
