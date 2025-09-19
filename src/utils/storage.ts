/**
 * Stores a value in the local storage with the specified key.
 *
 * @param {string} key - The key under which the value will be stored.
 * @param {*} value - The value to be stored in local storage.
 */
export function setLocalItem(key = "", value: string) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves an item from the local storage and parses it as JSON.
 *
 * @param {string} [key=""] - The key of the item to retrieve from local storage.
 * @returns {any} The parsed JSON object from local storage, or null if the key does not exist.
 */
export function getLocalItem(key = "") {
  const item = window.localStorage.getItem(key);
  return item !== null ? JSON.parse(item) : null;
}
