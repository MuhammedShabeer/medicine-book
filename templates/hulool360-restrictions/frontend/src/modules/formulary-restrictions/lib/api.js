// HTTP client for the module's ASP.NET Core endpoints.

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

/**
 * @param {object} cfg
 * @param {string} cfg.baseUrl   e.g. "/api/formulary-restrictions" or "https://api.example.org/api/formulary-restrictions"
 * @param {() => (string|null|Promise<string|null>)} [cfg.getToken]  returns the JWT for the Authorization header
 * @param {RequestCredentials} [cfg.credentials]  "include" if you authenticate with cookies instead of a bearer token
 * @param {Record<string,string>} [cfg.headers]   extra headers for every request
 */
export function createApi({ baseUrl = '/api/formulary-restrictions', getToken, credentials, headers: extra } = {}) {
  const base = baseUrl.replace(/\/+$/, '');

  async function request(path, { method = 'GET', body, headers = {}, raw = false, keepalive = false } = {}) {
    const h = { Accept: 'application/json', ...extra, ...headers };
    const token = getToken ? await getToken() : null;
    if (token) h.Authorization = `Bearer ${token}`;
    if (body !== undefined) h['Content-Type'] = 'application/json';
    const res = await fetch(base + path, {
      method, headers: h, credentials, keepalive,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (raw) return res;
    if (res.status === 304) return null;
    if (!res.ok) {
      let msg = res.status === 401 ? 'Your session has expired. Sign in again.' : res.status === 403 ? 'You do not have permission for this action.' : `Request failed (${res.status}).`;
      try { const j = await res.json(); if (j && j.error) msg = j.error; } catch { /* body was not JSON */ }
      throw new ApiError(msg, res.status);
    }
    return res.status === 204 ? null : res.json();
  }

  return {
    /** Returns { notModified: true } when the cached version is current, otherwise { dataset, etag }. */
    async dataset(etag) {
      const res = await request('/dataset', { raw: true, headers: etag ? { 'If-None-Match': etag } : {} });
      if (res.status === 304) return { notModified: true };
      if (!res.ok) throw new ApiError(res.status === 401 ? 'Your session has expired. Sign in again.' : `Could not load the formulary (${res.status}).`, res.status);
      return { dataset: await res.json(), etag: res.headers.get('ETag') };
    },
    me: () => request('/me'),
    usage: (events, keepalive = false) => request('/usage', { method: 'POST', body: { events }, keepalive }),
    admin: {
      dataset: () => request('/admin/dataset'),
      saveItem: (itemNo, input) => request(`/admin/items/${encodeURIComponent(itemNo)}`, { method: 'PUT', body: input }),
      removeItem: (itemNo) => request(`/admin/items/${encodeURIComponent(itemNo)}`, { method: 'DELETE' }),
      restoreItem: (itemNo) => request(`/admin/items/${encodeURIComponent(itemNo)}/restore`, { method: 'POST' }),
      createRestriction: (input) => request('/admin/restrictions', { method: 'POST', body: input }),
      saveRestriction: (id, input) => request(`/admin/restrictions/${encodeURIComponent(id)}`, { method: 'PUT', body: input }),
      removeRestriction: (id) => request(`/admin/restrictions/${encodeURIComponent(id)}`, { method: 'DELETE' }),
      restoreRestriction: (id) => request(`/admin/restrictions/${encodeURIComponent(id)}/restore`, { method: 'POST' }),
      setLinks: (id, itemNos) => request(`/admin/restrictions/${encodeURIComponent(id)}/links`, { method: 'PUT', body: { itemNos } }),
      analytics: (days) => request(`/admin/analytics?days=${days}`),
      userEvents: (userId, days) => request(`/admin/analytics/users/${encodeURIComponent(userId)}?days=${days}`),
      audit: (take = 200) => request(`/admin/audit?take=${take}`),
      exportFile: async (kind) => {
        const res = await request(`/admin/export.${kind}`, { raw: true });
        if (!res.ok) throw new ApiError(`Export failed (${res.status}).`, res.status);
        return res.blob();
      },
    },
  };
}
