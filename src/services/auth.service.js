import { loginRequest } from "../api/auth.api";

const TOKEN_KEY = "access_token";

export async function login(email, password) {
  const data = await loginRequest(email, password);

  if (data.access_token) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
  }

  return data;
}


export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getAccessToken();
}
