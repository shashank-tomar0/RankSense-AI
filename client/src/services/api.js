/**
 * RankSense AI — API service layer (Clerk-backed)
 *
 * Token is fetched from Clerk on every request via the
 * registered getter set by AuthContext.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Clerk token getter ─────────────────────────────────────────────────────
// AuthContext registers a getter so we can retrieve the Clerk session JWT
// without making api.js a React hook.
let _clerkTokenGetter = null;

export function setClerkTokenGetter(fn) {
  _clerkTokenGetter = fn;
}

async function getAuthToken() {
  if (!_clerkTokenGetter) return null;
  try {
    return await _clerkTokenGetter();
  } catch {
    return null;
  }
}

// ── Fetch wrapper ──────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = await getAuthToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      message = json.detail || json.message || message;
    } catch (_) {}
    throw new Error(message);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// ── Resume Analysis ────────────────────────────────────────────────────────
export async function apiAnalyzeResumes(files, jobTitle = "", jobDesc = "") {
  const token = await getAuthToken();
  const form = new FormData();
  for (const file of files) form.append("files", file);
  if (jobTitle) form.append("job_title", jobTitle);
  if (jobDesc) form.append("job_desc", jobDesc);

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      message = j.detail || message;
    } catch (_) {}
    throw new Error(message);
  }
  return res.json();
}

// ── Batches (history) ──────────────────────────────────────────────────────
export async function apiGetBatches() {
  return request("/batches");
}
export async function apiGetBatch(batchId) {
  return request(`/batches/${batchId}`);
}
export async function apiGetLatestBatch() {
  return request("/latest-batch");
}

// ── Health ─────────────────────────────────────────────────────────────────
export async function apiHealth() {
  return request("/health");
}

// ── Legacy stubs (kept so old imports don't crash during migration) ────────
export const getToken = () => null;
export const setToken = () => {};
export const removeToken = () => {};
export const apiLogin = () => Promise.reject(new Error("Use Clerk"));
export const apiRegister = () => Promise.reject(new Error("Use Clerk"));
export const apiGetMe = () => Promise.reject(new Error("Use Clerk"));
export const apiUpdatePlan = () =>
  Promise.reject(new Error("Plan managed via Clerk metadata"));
