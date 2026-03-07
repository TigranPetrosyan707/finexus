/**
 * Same-origin API client with session cookie and CSRF.
 */

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function getCsrfToken() {
  const token = getCookie('XSRF-TOKEN');
  if (token) return decodeURIComponent(token);
  return null;
}

const defaultHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  ...(getCsrfToken() ? { 'X-XSRF-TOKEN': getCsrfToken() } : {}),
});

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  async get(url) {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'same-origin',
      headers: defaultHeaders(),
    });
    return handleResponse(res);
  },

  async post(url, body = null) {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: defaultHeaders(),
      body: body != null ? JSON.stringify(body) : undefined,
    });
    return handleResponse(res);
  },

  async put(url, body) {
    const res = await fetch(url, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: defaultHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async delete(url) {
    const res = await fetch(url, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: defaultHeaders(),
    });
    return handleResponse(res);
  },
};
