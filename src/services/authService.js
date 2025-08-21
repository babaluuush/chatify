import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE = "https://chatify-api.up.railway.app";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

let csrfToken = null;

export async function ensureCsrf() {
  if (!csrfToken) {
    const res = await fetch(`${API_BASE}/csrf`, {
      method: "PATCH",
    });
    const data = await res.json();
    csrfToken = data.csrfToken;
  }
  return csrfToken;
}

export function loadAuth() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    return { token, user: payload };
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}
export function saveAuth(token) {
  localStorage.setItem("token", token);
  const payload = jwtDecode(token);
  return { token, user: payload };
}
export function clearAuth() {
  localStorage.removeItem("token");
}

// Auth
export async function registerUser({ username, email, password }) {
  await ensureCsrf();
  const res = await api.post(
    "/auth/register",
    { username, email, password, csrfToken },
  );
  return res.data;
}
export async function loginUser({ username, password }) {
  await ensureCsrf();
  const res = await api.post(
    "/auth/token",
    { username, password, csrfToken },
  );
  return res.data;
}

// Messages
export async function getMessages() {
  const token = localStorage.getItem("token");
  const res = await api.get("/messages", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
export async function createMessage({ text }) {
  await ensureCsrf();
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/messages",
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}
export async function deleteMessage(id) {
  await ensureCsrf();
  const token = localStorage.getItem("token");
  await api.delete(`/messages/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
