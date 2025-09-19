import { API_URL } from "../../constants";
import { getLocalItem } from "../../utils/storage";
import { ApiError } from "../error/error";

interface ApiClientOptions extends RequestInit {
  body?: BodyInit | null | undefined | string;
}

type Endpoint = string;

// TODO: Insert correct API key from storage.
const API_KEY_HEADER = "Dummy-API-Key";

/**
 * Makes an HTTP request to the specified API endpoint with the given options.
 *
 * This function automatically attaches JSON headers, API key, and access token from localStorage if available.
 * It handles both GET and POST requests based on the presence of a request body, and parses JSON responses.
 * Handles 204 No Content responses and throws a custom `ApiError` for HTTP errors.
 *
 * @param endpoint - The API endpoint to call (relative to `API_URL`).
 * @param options - Optional configuration for the request, including body and custom headers.
 * @returns The parsed JSON response, or `null` for 204 No Content.
 * @throws {ApiError} If the response is not OK and contains an error message.
 * @throws {Error} For network or client errors not related to the API response.
 */
async function apiClient(endpoint: string, options: ApiClientOptions = {}) {
  const { body, ...customOptions } = options;

  const headers: Record<string, string> = {};

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customOptions,
    headers: {
      ...headers,
      ...(customOptions.headers as Record<string, string>),
    },
  };

  if (body) {
    if (body instanceof FormData) {
      // If the body is FormData, let the browser set the Content-Type
      config.body = body;
    } else {
      // Otherwise, stringify as JSON and set the header
      config.body = JSON.stringify(body);
      (config.headers as Record<string, string>)["Content-Type"] =
        "application/json";
    }
  }

  const apiKey = getLocalItem("apiKey");
  const accessToken = getLocalItem("accessToken");

  if (apiKey)
    (config.headers as Record<string, string>)[API_KEY_HEADER] = apiKey;
  if (accessToken)
    (config.headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${accessToken}`;

  try {
    const response = await fetch(API_URL + endpoint, config);

    // Check if the response is empty before trying to parse JSON
    const contentType = response.headers.get("content-type");

    if (
      response.status === 204 ||
      !contentType ||
      !contentType.includes("application/json")
    ) {
      if (!response.ok) {
        throw new ApiError(`HTTP Error: ${response.status}`, response.status);
      }

      return null; // For successful 204 No Content
    }

    const responseData = await response.json();

    if (!response.ok) {
      const message =
        responseData.errors?.[0]?.message || `HTTP Error: ${response.status}`;
      throw new ApiError(message, response.status);
    }

    return responseData;
  } catch (error) {
    debugger;
    // If it's already our custom error, just re-throw it.
    // Otherwise, wrap it in a generic error.
    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error("A network or client error occurred.");
  }
}

// Now we can export helper methods
export const get = <T = unknown>(endpoint: Endpoint): Promise<T> =>
  apiClient(endpoint);

/**
 * Sends a POST request to the specified API endpoint with the provided request body.
 *
 * @param endpoint - The API endpoint to which the POST request will be sent.
 * @param body - The request payload to be sent in the body of the POST request.
 * @returns A promise resolving to the response from the API client.
 * @example
 * ```
 * import { post } from './services/api/client';
 *
 * async function createNewPost(postData) {
 *   try {
 *     const newPost = await post('/social/posts', postData);
 *   } catch (error) {
 *     console.error(error.message);
 *   }
 * }
 */
export const post = <T>(endpoint: Endpoint, body: T) =>
  apiClient(endpoint, { body: JSON.stringify(body) });

export const put = <T>(endpoint: Endpoint, body: T) =>
  apiClient(endpoint, { method: "PUT", body: JSON.stringify(body) });
export const del = (endpoint: Endpoint) =>
  apiClient(endpoint, { method: "DELETE" });
