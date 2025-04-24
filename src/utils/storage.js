/**
 * Retrieve the stored JWT from localStorage.
 * @returns {string|null} – the token string, or null if not set
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Persist a JWT in localStorage under the key "token".
 * @param {string} token – the JWT to save
 */
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

/**
 * Remove the stored JWT from localStorage, effectively logging out.
 */
export const clearToken = () => {
  localStorage.removeItem("token");
};

/**
 * Check whether a user is authenticated based on presence of a token.
 * @returns {boolean} – true if a token exists, false otherwise
 */
export const isAuthenticated = () => {
  return getToken() !== null;
};
