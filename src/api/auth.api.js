import api from "./axios";

export function loginRequest(email, password) {
  return api.post("/login", { email, password })
    .then(res => res.data);
}
